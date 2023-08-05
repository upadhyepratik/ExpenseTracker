document.addEventListener('DOMContentLoaded', () => {
    const incomeInput = document.getElementById('income');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const addExpenseButton = document.getElementById('addExpense');
    const expenseList = document.getElementById('expenseList');
    const remainingIncomeLabel = document.getElementById('remainingIncome');

    let income = 0;
    let expenses = [];
    let isIncomeSet = false;

    incomeInput.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !isIncomeSet) {
            income = parseFloat(incomeInput.value);
            incomeInput.disabled = true;
            isIncomeSet = true;
            updateRemainingIncome();
            descriptionInput.focus();
        }
    });

    function moveFocusOnEnter(event, nextElement) {
        if (event.key === 'Enter') {
            event.preventDefault();
            nextElement.focus();
        }
    }

    descriptionInput.addEventListener('keydown', event => {
        moveFocusOnEnter(event, amountInput);
    });

    amountInput.addEventListener('keydown', event => {
        moveFocusOnEnter(event, dateInput);
    });

    dateInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addExpenseButton.click();
        }
    });

    addExpenseButton.addEventListener('click', () => {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;

        if (description && !isNaN(amount) && date) {
            expenses.push({ description, amount, date });
            updateExpenseList();
            income -= amount;
            updateRemainingIncome();

            // Clear input values
            descriptionInput.value = '';
            amountInput.value = '';
            dateInput.value = '';

            descriptionInput.focus();
        }
    });

    function updateExpenseList() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.date}: ${expense.description}: ₹${expense.amount.toFixed(2)}`;
            expenseList.appendChild(li);
        });
    }

    function updateRemainingIncome() {
        remainingIncomeLabel.textContent = `Remaining Amount: ₹${income.toFixed(2)}`;
    }

    const generatePDFButton = document.getElementById('generatePDF');

    generatePDFButton.addEventListener('click', () => {
        const doc = new jsPDF();
        
        doc.text("Expense History", 10, 10);

        let yPos = 30;
        expenses.forEach(expense => {
            const entry = `${expense.date}: ${expense.description}: ₹${expense.amount.toFixed(2)}`;
            doc.text(entry, 10, yPos);
            yPos += 10;
        });

        doc.save("expense_history.pdf");
    });
});
