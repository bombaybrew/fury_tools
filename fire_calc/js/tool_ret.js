'use strict'

var global = {}
global.chart = {}

function onSubmit(e) {
    e.preventDefault()
    let {
        labels,
        expenseList,
        corpusList,
        corpusDisplayList
    } = calcRetirementNumbers()
    updateChart(labels, expenseList, corpusList, corpusDisplayList)
    updateTable(labels, expenseList, corpusList, corpusDisplayList)
    return false
}

function validate() {

}

function resetForm() {
    document.getElementById("form_ret").reset()
    return false
}

function calcRetirementNumbers() {
    let currAge = Number(document.getElementById("currAge").value)
    let retAge = Number(document.getElementById("retAge").value)
    let lifeExp = Number(document.getElementById("lifeExp").value)
    let roi = Number(document.getElementById("roi").value)
    let inflation = Number(document.getElementById("inflation").value)
    let yearlyExpense = Number(document.getElementById("yearlyExpense").value)
    let initialInvestment = Number(document.getElementById("initInv").value)
    let savingsBeforeRetirement = Number(document.getElementById("savingsBeforeRetirement").value)

    var processAge = currAge + 1
    var expense = yearlyExpense
    var corpus = initialInvestment

    var labels = []
    var expenseList = []
    var corpusList = []
    var corpusDisplayList = []
    var corpusString = ""

    console.log(currAge, processAge, lifeExp)

    while (processAge <= lifeExp) {

        corpusString = "(" + corpus.toFixed(1)

        if (processAge <= retAge) {
            corpusString = corpusString + " + " + (corpus * roi / 100).toFixed(1) + " + " + savingsBeforeRetirement + ")"
            corpus = corpus + (corpus * roi / 100) + savingsBeforeRetirement
        } else {
            corpusString = corpusString + " + " + (corpus * roi / 100).toFixed(1) + " - " + expense.toFixed(1) + ")"
            corpus = corpus - expense + (corpus * roi / 100)
        }

        labels.push(processAge)
        expenseList.push(expense.toFixed(1))
        corpusList.push(corpus.toFixed(1))
        corpusDisplayList.push(corpus.toFixed(1) + " " + corpusString)
        processAge = processAge + 1
        expense = expense + (expense * inflation / 100)
    }

    console.log(labels)

    return {
        labels,
        expenseList,
        corpusList,
        corpusDisplayList
    }
}

function updateTable(labels, expenseList, corpusList, corpusDisplayList) {
    var container = document.getElementById("tableContainer")
    let numOfRows = labels.length

    var table = document.createElement('table')
    table.classList.add("table")
    table.classList.add("is-striped")
    table.classList.add("is-fullwidth")
    table.classList.add("is-narrow")

    var thead = document.createElement('thead')
    var tr = document.createElement('tr')

    var thAge = document.createElement('th')
    var thCorpus = document.createElement('th')
    var thExpense = document.createElement('th')

    thAge.appendChild(document.createTextNode("Age"))
    thCorpus.appendChild(document.createTextNode("Corpus"))
    thExpense.appendChild(document.createTextNode("Expense"))

    tr.appendChild(thAge)
    tr.appendChild(thCorpus)
    tr.appendChild(thExpense)

    thead.appendChild(tr)
    table.appendChild(thead)

    var tbody = document.createElement('tbody')

    for (let i = 0; i < numOfRows; i++) {

        var tr = document.createElement('tr')

        var tdLabel = document.createElement('td')
        var tdCorpus = document.createElement('td')
        var tdExpense = document.createElement('td')

        tdLabel.appendChild(document.createTextNode(labels[i]))
        tdCorpus.appendChild(document.createTextNode(corpusDisplayList[i]))
        tdExpense.appendChild(document.createTextNode(expenseList[i]))

        tr.appendChild(tdLabel)
        tr.appendChild(tdCorpus)
        tr.appendChild(tdExpense)

        tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    container.innerHTML = ""
    container.appendChild(table)
}

function updateChart(labels, expenseList, corpusList, corpusDisplayList) {

    if (window.chart) {
        window.chart.destroy()
    }

    var ctx = document.getElementById('chart_ret').getContext('2d')

    window.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'expense',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132, 0.1)',
                data: expenseList
            }, {
                label: 'corpus',
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgb(153, 102, 255, 0.1)',
                data: corpusList
            }]
        },
        options: {
            hover: {
                mode: 'nearest'
            },
            tooltips: {
                intersect: false
            },
            elements: {
                point: {
                    radius: 1.2
                }
            }
        }
    })
}