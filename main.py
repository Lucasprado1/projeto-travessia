from flask import Flask, request, jsonify, send_from_directory, render_template
from openpyxl import Workbook, load_workbook
import os
from openpyxl.formula.translate import Translator #copy formula
from flask_cors import CORS


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
        #recebimentos_origem_destino()
        return '', 201
    else:
        return 'Nenhum arquivo selecionado.'
    


# =================================== inicio ==============================
def recebimentos_origem_destino():
    wb = load_workbook("sources/ModeloNEO-unicalinha.xlsx")
    wb1 = load_workbook("sources/base_NEO_raposo1.xlsx")

    aba_origem = wb1['Recebimentos']
    aba_destino = wb['Recebimentos']

    numero_de_linhas_recebimento = aba_origem.max_row
    print(numero_de_linhas_recebimento)

    aba_origem_recebiveis = wb1['Recebíveis']
    aba_destino_recebiveis = wb['Recebíveis']

    coluna_origem_inicio = 'S'
    coluna_origem_fim = 'Y'
    linha_origem = 2
    linhas_destino = numero_de_linhas_recebimento - 1


    


    numero_de_linhas_recebiveis = aba_origem_recebiveis.max_row
    print(numero_de_linhas_recebiveis)

    intervalo_recebimento = f'A2:R{numero_de_linhas_recebimento}'
    intervalo_recebiveis = f'A2:R{numero_de_linhas_recebiveis}'


    células_origem = aba_origem[intervalo_recebimento]
    células_destino = aba_destino[intervalo_recebimento]

    for row_origem, row_destino in zip(células_origem, células_destino):
        for célula_origem, célula_destino in zip(row_origem, row_destino):
            célula_destino.value = célula_origem.value

    aba_origem_recebiveis = aba_origem[intervalo_recebiveis]
    aba_destino_recebiveis = aba_destino[intervalo_recebiveis]

    for row_origem, row_destino in zip(aba_origem_recebiveis, aba_destino_recebiveis):
        for célula_origem, célula_destino in zip(row_origem, row_destino):
            célula_destino.value = célula_origem.value


    for linha in range(linhas_destino):
        for coluna_origem, coluna_destino in zip(range(ord(coluna_origem_inicio), ord(coluna_origem_fim) + 1), range(ord(coluna_origem_inicio), ord(coluna_origem_fim) + 1)):
            célula_origem = aba_destino[f"{chr(coluna_origem)}{linha_origem}"].value
            célula_destino = aba_destino[f"{chr(coluna_destino)}{linha_origem + linha}"]
            célula_destino.value = célula_origem
    

    wb.save("sources/ModeloNEOEdited.xlsx")


# ======================================== funcionando até aqui ==============

# for row_number in range(2, 22):  # Linhas de 2 a 21
#     cell = aba_ativa_relatorio.cell(row=row_number, column=4)  # Coluna "K" (11ª coluna)
#     cell.value = 45184

# for row in aba_ativa_relatorio.iter_rows(min_row=2, max_row=21, min_col=11, max_col=17):
#     for cell in row:
#         i = i + 1
#         print(cell)
#         cell.value = 10

# for row in aba_ativa_relatorio.iter_rows(min_row=2, max_row=21, min_col=11, max_col=17):
#     for cell in row:
#         i = i + 1
#         print(cell)
#         cell.value = 10


# print("quantidade: ", i)


if __name__ == '__main__':
    api.run(debug=True)