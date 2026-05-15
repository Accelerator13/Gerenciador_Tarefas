# ============================================
#   GERENCIADOR DE TAREFAS
# ============================================

# Uma lista para guardar nossas tarefas na memória
tarefas = []


def mostrar_menu():
    """Exibe o menu principal para o usuário."""
    print("\n" + "=" * 40)
    print("       GERENCIADOR DE TAREFAS")
    print("=" * 40)
    print("1. Ver todas as tarefas")
    print("2. Adicionar tarefa")
    print("3. Marcar tarefa como concluída")
    print("4. Remover tarefa")
    print("5. Sair")
    print("=" * 40)


def ver_tarefas():
    """Mostra todas as tarefas cadastradas."""
    if len(tarefas) == 0:
        print("\nNenhuma tarefa cadastrada ainda!")
        return

    print("\n--- SUAS TAREFAS ---")
    for i, tarefa in enumerate(tarefas):
        # enumerate() retorna o índice (número) e o item ao mesmo tempo
        numero = i + 1  # começamos em 1 para o usuário
        status = "✓" if tarefa["concluida"] else "○"
        nome = tarefa["nome"]
        print(f"{numero}. [{status}] {nome}")


def adicionar_tarefa():
    """Pede o nome de uma tarefa e a adiciona à lista."""
    nome = input("\nNome da tarefa: ").strip()

    if nome == "":
        print("O nome não pode ser vazio!")
        return

    # Cada tarefa é um dicionário com dois campos
    nova_tarefa = {
        "nome": nome,
        "concluida": False
    }

    tarefas.append(nova_tarefa)
    print(f'Tarefa "{nome}" adicionada com sucesso!')


def marcar_concluida():
    """Marca uma tarefa como concluída."""
    ver_tarefas()

    if len(tarefas) == 0:
        return

    try:
        numero = int(input("\nNúmero da tarefa a concluir: "))
        indice = numero - 1  # convertemos de volta para índice da lista

        if indice < 0 or indice >= len(tarefas):
            print("Número inválido!")
            return

        tarefas[indice]["concluida"] = True
        nome = tarefas[indice]["nome"]
        print(f'Tarefa "{nome}" marcada como concluída!')

    except ValueError:
        # Isso acontece se o usuário digitar algo que não é um número
        print("Por favor, digite um número válido!")


def remover_tarefa():
    """Remove uma tarefa da lista."""
    ver_tarefas()

    if len(tarefas) == 0:
        return

    try:
        numero = int(input("\nNúmero da tarefa a remover: "))
        indice = numero - 1

        if indice < 0 or indice >= len(tarefas):
            print("Número inválido!")
            return

        tarefa_removida = tarefas.pop(indice)  # pop() remove e retorna o item
        nome = tarefa_removida["nome"]
        print(f'Tarefa "{nome}" removida!')

    except ValueError:
        print("Por favor, digite um número válido!")


def main():
    """Função principal — controla o fluxo do programa."""
    print("Bem-vindo ao Gerenciador de Tarefas!")

    while True:  # loop infinito até o usuário escolher sair
        mostrar_menu()
        opcao = input("Escolha uma opção (1-5): ").strip()

        if opcao == "1":
            ver_tarefas()
        elif opcao == "2":
            adicionar_tarefa()
        elif opcao == "3":
            marcar_concluida()
        elif opcao == "4":
            remover_tarefa()
        elif opcao == "5":
            print("\nAté logo! 👋")
            break  # encerra o loop e o programa
        else:
            print("Opção inválida! Escolha entre 1 e 5.")


# Ponto de entrada do programa
# Este bloco só executa quando rodamos o arquivo diretamente
if __name__ == "__main__":
    main()