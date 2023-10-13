from flask import Flask, request, jsonify, send_from_directory, render_template
from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter, column_index_from_string
import os
from openpyxl.formula.translate import Translator #copy formula
from flask_cors import CORS
from openpyxl.styles import Protection


DIRETORIO = "./sources"

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
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        print(uploaded_file)
        nome_do_arquivo = uploaded_file.filename
        uploaded_file.save(os.path.join(DIRETORIO, nome_do_arquivo))
        neo_report_model(uploaded_file.filename) # NEO model pattern 
        return '', 201
    else:
        return 'Nenhum arquivo selecionado.'
    


# =================================== inicio ==============================

def neo_report_model(base_filename):
    load_workbooks(base_filename)
    model_report_wb = load_workbook("sources/Modelo Relatório - NEO - RAPOSO.xlsx")
    source_base_model_report_wb = load_workbook(f"sources/{base_filename}")
    linhas_destino_recebimento = 0
    linhas_destino_recebiveis = 0
    linhas_destino_base_contrato = 0

    aba_destino_base_contrato = model_report_wb['Base Contratos']

    aba_origem_relacao_contrato = source_base_model_report_wb['Relação de Contratos']
    aba_destino_relacao_contrato = model_report_wb['Relação de Contratos']

    aba_origem_recebimento = source_base_model_report_wb['Recebimentos']
    aba_destino_recebimento = model_report_wb['Recebimentos']


    aba_origem_recebiveis = source_base_model_report_wb['Recebíveis']
    aba_destino_recebiveis = model_report_wb['Recebíveis']
    rows = 0

    for max_row, row in enumerate(aba_origem_recebimento, 1):
        if not all(col.value is None for col in row):
            rows += 1
    linhas_destino_recebimento = rows
    rows = 0
    for max_row, row in enumerate(aba_origem_recebiveis, 1):
        if not all(col.value is None for col in row):
            rows += 1
    linhas_destino_recebiveis = rows
    rows = 0

    coluna_origem_inicio = 'S'
    coluna_origem_fim = 'Y'
    linha_origem = 2

    #joga formula recebimento 
    for linha_origem in range(linha_origem, linhas_destino_recebimento):
        for col in range(19, 26):
            celula_origem = aba_destino_recebimento.cell(row=linha_origem, column=col)
            celula_destino = aba_destino_recebimento.cell(row=linha_origem + 1, column=col)

            celula_destino.value = Translator(celula_origem.value, origin=celula_origem.coordinate).translate_formula(celula_destino.coordinate)
    #joga formula recebiveis
    linha_origem = 0    
    for linha_origem in range(linha_origem + 7, linhas_destino_recebiveis + 5):
        for col in range(13, 19):
            celula_origem = aba_destino_recebiveis.cell(row=linha_origem, column=col)
            celula_destino = aba_destino_recebiveis.cell(row=linha_origem + 1, column=col)

            celula_destino.value = Translator(celula_origem.value, origin=celula_origem.coordinate).translate_formula(celula_destino.coordinate)
    linha_origem = 0    
          
    intervalo_recebimento = f'A2:R{linhas_destino_recebimento}'
    intervalo_recebiveis_destino = f'A7:L{linhas_destino_recebiveis + 7}'
    intervalo_recebiveis_destino_origem = f'A2:L{linhas_destino_recebiveis}'
    intervalo_relacao_contrato = f'A2:K{linhas_destino_recebiveis}'

    #cola recebimento 
    células_origem = aba_origem_recebimento[intervalo_recebimento]
    células_destino = aba_destino_recebimento[intervalo_recebimento]

    for row_origem, row_destino in zip(células_origem, células_destino):
        for célula_origem, célula_destino in zip(row_origem, row_destino):
            célula_destino.value = célula_origem.value

    #cola recebiveis
    celulas_origem_recebiveis = aba_origem_recebiveis[intervalo_recebiveis_destino_origem]
    celulas_destino_recebiveis = aba_destino_recebiveis[intervalo_recebiveis_destino]

    for row_origem, row_destino in zip(celulas_origem_recebiveis, celulas_destino_recebiveis):
        for célula_origem, célula_destino in zip(row_origem, row_destino):
            célula_destino.value = célula_origem.value

    #cola relação contrato
    celulas_origem_relacao_contrato = aba_origem_relacao_contrato[intervalo_relacao_contrato]
    celulas_destino_relacao_contrato = aba_destino_relacao_contrato[intervalo_relacao_contrato]

    for row_origem, row_destino in zip(celulas_origem_relacao_contrato, celulas_destino_relacao_contrato):
        for célula_origem, célula_destino in zip(row_origem, row_destino):
            célula_destino.value = célula_origem.value

    #pega array com duplicatas em recebiveis
    array_duplicatas = []
    
    for row in aba_origem_recebiveis.iter_rows(min_row=2, max_row=linhas_destino_recebiveis, min_col=1, max_col=1):
        for cell in row:
            array_duplicatas.append(cell.value)  
    array_tratado = list(set(array_duplicatas))
    linhas_destino_base_contrato = len(array_tratado)

    #cola formulas base contratos
    for linha_origem in range(linha_origem + 3, linhas_destino_base_contrato + 2):
        for col in range(3, 8):
            celula_origem = aba_destino_base_contrato.cell(row=linha_origem, column=col)
            celula_destino = aba_destino_base_contrato.cell(row=linha_origem + 1, column=col)

            celula_destino.value = Translator(celula_origem.value, origin=celula_origem.coordinate).translate_formula(celula_destino.coordinate)

    # cola valores de array_tratado em aba base contratos
    i = 0
    for row in aba_destino_base_contrato.iter_rows(min_row=3, max_row=linhas_destino_base_contrato + 2, min_col=2, max_col=2):
        for cell in row:
            cell.value = array_tratado[i]
        i = i+1

    aba_destino_recebimento.protection = Protection(locked=True,hidden=True)
    model_report_wb.save("sources/ModeloNEOEdited.xlsx")
    # reescreve()



# ======================================== funcionando até aqui ==============

# for row_number in range(2, 22):  # Linhas de 2 a 21
#     cell = aba_ativa_relatorio.cell(row=row_number, column=4)  # Coluna "K" (11ª coluna)
#     cell.value = 45184



if __name__ == '__main__':
    api.run(debug=True)