function calcularIdade(e) {
  e.preventDefault()
  const dataNascimento = new Date (document.getElementById("dataNascimento").value);
  const dataAtual = new Date();
  let anos = dataAtual.getUTCFullYear() - dataNascimento.getUTCFullYear();
  let meses = dataAtual.getUTCMonth() - dataNascimento.getUTCMonth();
  if (dataAtual.getUTCMonth() > dataNascimento.getUTCMonth()) {
    meses = dataAtual.getUTCMonth() - dataNascimento.getUTCMonth();
  } else {
    meses = 12 - (dataNascimento.getUTCMonth() - dataAtual.getUTCMonth());
    anos--;
  } 
  let dias = dataAtual.getUTCDate() - dataNascimento.getUTCDate();
  if (dias < 0) { 
    meses--;
    dias += new Date(Date.UTC(dataAtual.getUTCFullYear(), dataAtual.getUTCMonth(), 0)).getUTCDate();
  }
  document.getElementById("resultado").innerHTML = `Idade: ${anos} anos, ${meses} meses , ${dias} dias`;
  if (anos >= 1) meses = meses + anos * 12
  exibirVacinasNecessarias(meses);
}
  const form = document.getElementById("form")
  form.addEventListener("submit",calcularIdade)
   

  async function getVacinas(){
    const response= await fetch("../data/infantil.json");
    const vacinas = await response.json();
    return vacinas;
    // let vacinasHtml = vacinas.map((vacina)=> converterHtml(vacina));
    // console.log(vacinasHtml[12])

    // const vacinasrContainer = document.getElementById("tabela");
    // vacinasrContainer.innerHTML = vacinasHtml
  }

function  criarCheckbox (dose, vacina){
    let dosesHtml= []
    if (dose== 0){
      let paragrafo = document.createElement('p')
      paragrafo.innerHTML = 'não tem dose de reforço'
      paragrafo.classList.add('card-p')
        return "não tem dose de reforço"
    } else {
        for(let i = 1; i <= dose; i++){
            dosesHtml.push(`<label>
            <input onclick="funcaoTeste(${vacina})" class="card-check" type="checkbox">
            ${i}º dose
            </label>`)
        }
        return dosesHtml.join("")
    }

}

function funcaoTeste(vacina){
  let numeroDoses = vacina.idadeRecomendada.length
  let dosesMarcadas = 0 
  for(var i in document.dosesVacinas.childNodes){
    console.log(i)
        if(document.dosesVacinas.childNodes[i].type == "checkbox" && document.dosesVacinas.childNodes[i].checked == true) dosesMarcadas++;
        if (i == document.dosesVacinas.lastElementChild && numeroDoses == dosesMarcadas)
        alert("oie")
  } 
}




// getVacinas()

  function converterHtml (vacina, doses) {
    return`<div class="card">
      <h3 class="card-h3">${vacina.Vacina}</h3>
      <h4 class="card-h4">Doses</h4>
      <form name="dosesVacinas" class="div-check">${criarCheckbox(doses,vacina)}</form>
      <h4 class="card-h4">Reforço</h4>
      <form name="dosesReforco" class="div-check">${criarCheckbox(vacina.numeroDosesReforco, vacina)}</form>
      <p class="card-p">${vacina.informacaoAdicional ? `${vacina.informacaoAdicional}` : ""}</p>
    </div>`
  }

  function exibirVacinasNecessarias(idade) {
    const vacinasjson = getVacinas().then(function(vacinas){
        const vacinasNecessarias = vacinas.filter((vacina) => {
            return idade >= vacina.idadeRecomendada[0];
          });
        
          const vacinasHtml = vacinasNecessarias.map((vacina) => {
            let doses = 0
            
            for (dose of vacina.idadeRecomendada){
                if (idade >= dose) doses++
            } 
            return converterHtml(vacina, doses)
          } );
          const vacinasContainer = document.getElementById("tabela");
          vacinasContainer.innerHTML = vacinasHtml.join("");
    })
  }

