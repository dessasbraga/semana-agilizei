/// <reference types="cypress" />


import {format, prepareLocalStorage} from  '../support/utils'

///hooks
//trechos que executam antes e depois do teste
//before -> antes de todos os testes
//beforeEach -> antes de cada teste
//after -> depois de todos os testes
//afteEach -> depois de cada teste

context('Dev Finances Agilizei', () => {


beforeEach(()=>{
    cy.visit('https://devfinance-agilizei.netlify.app/',{
    onBeforeLoad: (win) => {
        prepareLocalStorage(win)
    }
})

});
it('Cadastrar entradas', () => {
    //-entender o fluxo manualmente
    //-mapear os elementos que vamos interagir
    //-descrever as interações com o cypress
    //-adicionar as asserções que a a gente precisa

    cy.get('#transaction .button').click() //id + classe
    cy.get('#description').type('Mesada') //id
    cy.get('[name=amount]').type(12) //atributos
    cy.get('[type=date]').type('2021-07-29') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor  
    cy.get('#data-table tbody tr').should('have.length', 3)

});

it('Cadastrar saidas', () => {
        //-entender o fluxo manualmente
        //-mapear os elementos que vamos interagir
        //-descrever as interações com o cypress
        //-adicionar as asserções que a a gente precisa

    
    cy.get('#transaction .button').click() //id + classe
    cy.get('#description').type('Mesada') //id
    cy.get('[name=amount]').type(-12) //atributos
    cy.get('[type=date]').type('2021-07-29') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor  
    cy.get('#data-table tbody tr').should('have.length', 3)
       
});
    
it('Remover entradas e saídas', () => {
 
    
    // estratégia 1: voltar para elemento pai e avançar para um td img attr
    
    //sempre que usar o contains, adicionar um get antes para filtrar onde buscar o texto
    cy.get('td.description')
        .contains("Mesada")
        .parent()
        .find('img[onclick*=remove]')
        .click()

    //estratégia 2: buscar todo os irmãos e buscar o que tem img + attr
    cy.get('td.description')
    .contains('Suco Kapo')
        .siblings() //elementos irmãos
        .children('img[onclick*=remove]')
        .click()

        cy.get('#data-table tbody tr').should('have.length', 0)

});
   
it('Validar  saldo com  diversas transações', () => {

    
    // capturar as linhas com as transações e as colunas com valores
    //capturar o texto dessa colunas
    //formatar esses valores das linhas
    //somar os valores de entradas e saidas
    //capturar o texto do total
    //comparar o somatorio de entradas e despesas com o total

    let incomes = 0
    let expenses = 0
    cy.get('#data-table tbody tr')
    .each(($el, index, $list)=> {
        cy.get($el).find('td.income, td.expense').invoke('text').then(text=> {
            if(text.includes('-')){
                expenses = expenses + format(text)
            }else {
                incomes = incomes + format(text)
            }

            cy.log('entradas',incomes)
            cy.log('saidas',expenses)

        })
        

    })
     cy.get('#totalDisplay').invoke('text').then(text => {
         let formattedTotalDisplay = format(text)
         let expectedTotal = incomes + expenses
         expect(formattedTotalDisplay).to.eq(expectedTotal)
     })
});
   

});