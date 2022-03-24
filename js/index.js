const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputtransactionsAmounts = document.querySelector('#amount')

/*
let dummyTransactions = [
    { id: 1, name: 'Bolo de brigadeiro', amount: -20 },
    { id: 2, name: 'Salário', amount: 300 },
    { id: 3, name: 'Torta de Frango', amount: -10 },
    { id: 4, name: 'Violão', amount: 150 }
]*/

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []
const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.append(li)
    //transactionsUl.prepend(li)
}
/* função acima atualizada usando codificação Destructuring 
const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
    </button>
    `
    transactionsUl.append(li)
    //transactionsUl.prepend(li)
}
*/

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    //soma os valores menores que zero
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2))

const getIncome = transactionsAmounts => transactionsAmounts
    //soma os valores maiores que zero
    .filter((value) => value > 0) //filter, cria outro array com o filtro específico
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    //o 0 no final da func abaixo serve para somar a primeira vez. 
    //reduce pega a lista e reduz para um único valor(neste caso a soma).
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2) //to fixed (2) significa 2 decimais após o valor somado final.

const updateBalanceValues = () => {
    //O método map() invoca a função callback passada por argumento para cada elemento
    // do Array e devolve um novo Array como resultado.
    //armazena em um array os valores positivos e negativos
    const transactionsAmounts = transactions.map(({ amount }) => amount)
    //const transactionsAmounts = transactions.map(transaction => transaction.amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    //Passa as informações para a tela
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

//add no local storage
const updateLocalStorage = () => {
    //passa os valores em string para o localstorage
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionsAmounts) => {
    transactions.push({
        //ADD no array de transações
        id: generateID(),
        name: transactionName,
        amount: Number(transactionsAmounts) //converte para number, pois estava havendo inserções de string no array.
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputtransactionsAmounts.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault() //impede que o form seja enviada e a página recarregue

    //valores inseridos no input
    const transactionName = inputTransactionName.value.trim()
    const transactionsAmounts = inputtransactionsAmounts.value.trim()
    const isSomeInputEmpty = inputTransactionName.value.trim() === '' || inputtransactionsAmounts.value.trim() === ''
    //verifica se o input foi preencheido
    if (isSomeInputEmpty) {
        alert("Por favor, preencha tanto o nome quanto o valor.")
        return
    }

    addToTransactionsArray(transactionName, transactionsAmounts)
    init()//invoca init para atualizar as info na tela
    updateLocalStorage()//atualiza o localstorage
    cleanInputs()//limpa os campos

}

//função executada quando houver um submit
form.addEventListener('submit', handleFormSubmit)