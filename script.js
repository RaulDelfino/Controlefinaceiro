const transactionsUl = document.querySelector('#transactions') // selecionei a Classe do HTML
const incomeDisplay = document.querySelector('#money-plus')
const expreseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')

const form = document.querySelector("#form")
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector("#amount")

// LocalStorage

const localStorageTransactions = JSON.parse(localStorage
    .getItem("transactions"))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []



    // botao de fechar
const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID),
    upadteLocalStorage()
    init()

}


// Função com as condição necessarias para a lista de Histórico 
const addTransactionIntoDOM =  transaction => {

    const operactor = transaction.amount < 0 ? '-' : '+' // if - se for menor que 0 = "-" , se nao for = "+"
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus' // if - se for menor que 0 a classe é "minus" , se nao é "plus"
    const amountWithoutOparaction = Math.abs(transaction.amount) // tirar o sinal de - 
    const li = document.createElement("li")

    li.classList.add(CSSClass) // adicionar li com a classe da var CSSClass
    li.innerHTML = `
        ${transaction.name} 
        <span>${operactor} R$ ${amountWithoutOparaction}</span> 
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x 
        </button>
    `
    transactionsUl.prepend(li) // prepend adiciona o elemento em primeiro lugar da lista
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator , value) => accumulator + value, 0)
    .toFixed(2)) 

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator , transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(transaction => transaction.amount)
    const total = getTotal(transactionsAmounts) // responsavel pela soma das transições
    
    const income = getIncome(transactionsAmounts) // pegar todos os valores positivos para somar na reseita

    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expreseDisplay.textContent = `R$ ${expense}`


} // essa funçao é somente para pegar o transactions.Amount e retornar os numeros


const init =   () => {

    transactionsUl.innerHTML = ''

    transactions.forEach(addTransactionIntoDOM)

    updateBalanceValues()

}// Quando a pagina for carregada essa função vai carregar as transições


init()

const upadteLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    
    transactions.push(
        {id : generateID() ,
        name : transactionName, 
        amount : Number(transactionAmount)
    })  
}

const clearInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value= ''
}

const handleFormSubmit =  event => {
    event.preventDefault() // verificar antes dos valores serem enviados

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
    
    if (isSomeInputEmpty) {
        alert('Porfavor preencha todos os campos')
        return
    } // para não ter erro 

        addToTransactionsArray(transactionName, transactionAmount)
        init()
        upadteLocalStorage()
        clearInputs()


        

}

form.addEventListener("submit" , handleFormSubmit)