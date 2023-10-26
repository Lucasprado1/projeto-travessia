from flask import Flask, request, jsonify, send_from_directory, render_template
from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter, column_index_from_string
import os
from openpyxl.formula.translate import Translator #copy formula
from flask_cors import CORS
from openpyxl.styles import Protection
import datetime
import pyxlsb
import openpyxl

DIRETORIOBASES = "./sources/bases/"
DIRETORIO = "./sources/"


global_filename = None

api = Flask(__name__)
CORS(api)

@api.route("/")
def tela_home():
    return render_template('index.html')

@api.route("/arquivos", methods=["GET"])
def lista_arquivos():
    arquivos = []

    for nome_do_arquivo in os.listdir(DIRETORIO):
        endereco_do_arquivo = os.path.join(DIRETORIO, nome_do_arquivo)

        if(os.path.isfile(endereco_do_arquivo)):
            arquivos.append(nome_do_arquivo)

    return jsonify(arquivos)


@api.route("/arquivos/<nome_do_arquivo>",  methods=["GET"])
def get_arquivo(nome_do_arquivo):
    return send_from_directory(DIRETORIO, nome_do_arquivo, as_attachment=True)


@api.route("/arquivos", methods=["POST"])
def post_arquivo():
    global global_filename
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        print(uploaded_file)
        nome_do_arquivo = uploaded_file.filename
        uploaded_file.save(os.path.join(DIRETORIOBASES, nome_do_arquivo))
        global_filename = uploaded_file.filename
        return '', 201
    else:
        return 'Nenhum arquivo selecionado.'

@api.route("/data", methods=["POST"])
def post_data():
    global global_filename
    if request.is_json:
        data = request.get_json()
        print('Data received:', data)
        if(global_filename): # variável global contendo o filename
            define_operation(global_filename, data) 
        return jsonify({"message": "Dados recebidos com sucesso!"}), 200
    else:
        return jsonify({"error": "Solicitação inválida. Certifique-se de enviar dados JSON."}), 400

# 'Raposo', 'Ibira', 'Atmosfera', 'Barbosa', 'Barreiras', 'FiveSenses', 'GramPoeme',
#  'LotesCia', 'Ommar', 'PatioLusitania', 'EntreSerras', 'Pardini', 'Dpaula'    

# =================================== inicio ==============================
def define_operation(global_filename, data):
    convert_xlsb_to_xlsx(f"sources/bases/{global_filename}", "sources/bases/output.xlsx")

    if(data["selectedOperation"] == 'Raposo'):
        neo_report_model_raposo(global_filename, data)
    elif(data["selectedOperation"] == 'Ibira'):
        neo_report_model_ibira(global_filename, data)    
    elif(data["selectedOperation"] == 'Atmosfera'):
        neo_report_model_raposo(global_filename, data)
    elif(data["selectedOperation"] == 'FiveSenses'):
        neo_report_model_raposo(global_filename, data)
    else:
        print("Reading operation name Error")

def convert_xlsb_to_xlsx(input_xlsb_filename, output_xlsx_filename):
    # Abrir o arquivo .xlsb
    with pyxlsb.open_workbook(input_xlsb_filename) as wb:
        dest_wb = openpyxl.Workbook()
        for sheetname in wb.sheets:
            dest_ws = dest_wb.create_sheet(title=sheetname)
            for row in wb.get_sheet(sheetname):
                dest_ws.append([item.v for item in row])

    # Salvar o arquivo .xlsx
    dest_wb.save(output_xlsx_filename)

def get_rows_number(working_tab):
    rows = 0
    for max_row, row in enumerate(working_tab, 1):
        if not all(col.value is None for col in row):
            rows += 1
    return rows

def grab_formulas(start_line, end_line, working_tab, start_col, end_col):
    for line in range(start_line, end_line):
        for col in range(start_col, end_col):
            
            celula_origem = working_tab.cell(row=line, column=col)
            celula_destino = working_tab.cell(row=line + 1, column=col)

            celula_destino.value = Translator(celula_origem.value, origin=celula_origem.coordinate).translate_formula(celula_destino.coordinate)

def copy_and_paste_cells(origin_cells, target_cells):
    for origin_row, target_row in zip(origin_cells, target_cells):
        for origin_cell, target_cell in zip(origin_row, target_row):
            target_cell.value = origin_cell.value



def paste_base_contratos(origin_working_tab, max_row_size, target_working_tab, operation):
    array_duplicatas = []
    for row in origin_working_tab.iter_rows(min_row=2, max_row=max_row_size, min_col=1, max_col=1):
        for cell in row:
            array_duplicatas.append(cell.value)  
    array_tratado_1 = list(set(array_duplicatas))
    array_tratado = []
    for item in array_tratado_1:
        if item is not None:
            if operation == 'Ibira':
                array_tratado.append(item)
            else:
                array_tratado.append(int(item))

    #cola formulas base contratos
    if (operation == 'Raposo'):
        grab_formulas(3, len(array_tratado) + 2, target_working_tab, 3, 8)
    elif (operation == 'Ibira'):
        grab_formulas(3, len(array_tratado) + 2, target_working_tab, 3, 9)
    else:
        print("Reading operation name Error on 'paste_base_contratos'")
    # cola valores de array_tratado em aba base contratos
    i = 0
    for row in target_working_tab.iter_rows(min_row=3, max_row=len(array_tratado) + 2, min_col=2, max_col=2):
        for cell in row:
            cell.value = array_tratado[i]
        i = i+1

def insert_close_date(operation, closeDate, working_tab):
    if(operation == 'Raposo'):
        #cell = working_tab.cell(row=3, column=12)  # Coluna "L" (12ª coluna)
        cell = working_tab.cell(row=1, column=1)
        iso_date = datetime.datetime.strptime(closeDate, "%Y-%m-%dT%H:%M:%S.%fZ")
        excelCloseDate = iso_date.strftime("%d/%m/%Y")
        cell.value = excelCloseDate

def load_working_tabs(model_report_wb, source_base):
    abas = {}
    
    abas['aba_destino_base_contrato'] = model_report_wb['Base Contratos']
    abas['aba_origem_relacao_contrato'] = source_base['Relação de Contratos']
    abas['aba_destino_relacao_contrato'] = model_report_wb['Relação de Contratos']
    abas['aba_origem_recebimento'] = source_base['Recebimentos']
    abas['aba_destino_recebimento'] = model_report_wb['Recebimentos']
    abas['aba_origem_recebiveis'] = source_base['Recebíveis']
    abas['aba_destino_recebiveis'] = model_report_wb['Recebíveis']
    
    return abas

def perform_data_copy_and_paste(tabs, intervalo_recebimento_origem, intervalo_recebiveis_destino, intervalo_recebiveis_origem, intervalo_relacao_contrato, linhas_destino_recebiveis, selected_operation):
    #cola recebimento 
    copy_and_paste_cells(tabs['aba_origem_recebimento'][intervalo_recebimento_origem], tabs['aba_destino_recebimento'][intervalo_recebimento_origem])
    #cola recebiveis
    copy_and_paste_cells(tabs['aba_origem_recebiveis'][intervalo_recebiveis_origem], tabs['aba_destino_recebiveis'][intervalo_recebiveis_destino])
    #cola relação contrato
    copy_and_paste_cells(tabs['aba_origem_relacao_contrato'][intervalo_relacao_contrato], tabs['aba_destino_relacao_contrato'][intervalo_relacao_contrato])
    # pega array com duplicatas em recebiveis
    paste_base_contratos(tabs['aba_origem_recebiveis'], linhas_destino_recebiveis, tabs['aba_destino_base_contrato'], selected_operation )


def neo_report_model_raposo(base_filename, data):
    print('data')
    # model_report_wb = load_workbook("sources/Modelo Relatório - NEO - RAPOSO.xlsx")
    model_report_wb = load_workbook("sources/modelo-Raposo.xlsx")
    source_base = load_workbook(f"sources/bases/{base_filename}")

    tabs = load_working_tabs(model_report_wb, source_base)

    aba_origem_recebimento = tabs['aba_origem_recebimento'] # inicialização necessária para definir o 'intervalo_recebimento_origem'
    aba_origem_recebiveis = tabs['aba_origem_recebiveis']   #                             ''

    linhas_destino_recebiveis = 0
    # inputa data de fechamento
    insert_close_date(data["selectedOperation"], data["selectedDate"], tabs['aba_destino_recebiveis'])
    #joga formula recebimento 
    grab_formulas(2, get_rows_number(tabs['aba_origem_recebimento']),tabs['aba_destino_recebimento'], 20, 27)
    #joga formula recebiveis
    grab_formulas(7, get_rows_number(tabs['aba_origem_recebiveis']) + 5, tabs['aba_destino_recebiveis'], 15, 21)
    grab_formulas(7, get_rows_number(tabs['aba_origem_recebiveis']) + 5, tabs['aba_destino_recebiveis'], 1, 1)

    intervalo_recebimento_origem = f'A2:R{get_rows_number(aba_origem_recebimento)}'
    intervalo_recebiveis_destino = f'A7:L{get_rows_number(aba_origem_recebiveis) + 7}'
    intervalo_recebiveis_origem = f'A2:L{get_rows_number(aba_origem_recebiveis)}'
    intervalo_relacao_contrato = f'A2:K{get_rows_number(aba_origem_recebiveis)}'

    perform_data_copy_and_paste(tabs, intervalo_recebimento_origem, intervalo_recebiveis_destino, intervalo_recebiveis_origem, intervalo_relacao_contrato,linhas_destino_recebiveis, data["selectedOperation"])

    model_report_wb.save("sources/ModeloNEOEdited.xlsx")

def neo_report_model_ibira(base_filename, data):
    print('data')
    # model_report_wb = load_workbook("sources/Modelo Relatório - NEO - RAPOSO.xlsx")
    model_report_wb = load_workbook("sources/modelo-Ibira.xlsx")
    source_base = load_workbook(f"sources/bases/output.xlsx")

    tabs = load_working_tabs(model_report_wb, source_base)

    aba_origem_recebimento = tabs['aba_origem_recebimento'] # inicialização necessária para definir o 'intervalo_recebimento_origem'
    aba_origem_recebiveis = tabs['aba_origem_recebiveis']   #                             ''

    linhas_destino_recebiveis = 0
    # inputa data de fechamento
    insert_close_date(data["selectedOperation"], data["selectedDate"], tabs['aba_destino_recebiveis'])
    #joga formula recebimento 
    grab_formulas(2, get_rows_number(tabs['aba_origem_recebimento']),tabs['aba_destino_recebimento'], 19, 26)
    #joga formula recebiveis
    grab_formulas(7, get_rows_number(tabs['aba_origem_recebiveis']) + 5, tabs['aba_destino_recebiveis'], 13,19)

    intervalo_recebimento_origem = f'A2:S{get_rows_number(aba_origem_recebimento)}'
    intervalo_recebiveis_destino = f'A7:L{get_rows_number(aba_origem_recebiveis) + 7}'
    intervalo_recebiveis_origem = f'A2:M{get_rows_number(aba_origem_recebiveis)}'
    intervalo_relacao_contrato = f'A2:K{get_rows_number(aba_origem_recebiveis)}'

    perform_data_copy_and_paste(tabs, intervalo_recebimento_origem, intervalo_recebiveis_destino, intervalo_recebiveis_origem, intervalo_relacao_contrato,linhas_destino_recebiveis, data["selectedOperation"])

    model_report_wb.save("sources/ModeloNEOEdited.xlsx")



if __name__ == '__main__':
    api.run(debug=True)