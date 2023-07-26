function calcularIdade(e) {
    e.preventDefault()
    const dataNascimento = new Date (document.getElementById("dataNascimento").value);
    const dataAtual = new Date();
  
    let anos = dataAtual.getUTCFullYear() - dataNascimento.getUTCFullYear();
    let meses = dataAtual.getUTCMonth() - dataNascimento.getUTCMonth();
    if (meses < 0 || (meses === 0 && dataAtual.getUTCDate() < dataNascimento.getUTCDate())) {
    anos--;
    meses += 12;
  }
  
  let dias = dataAtual.getUTCDate() - dataNascimento.getUTCDate();
  if (dias < 0) {
    meses--;
    dias += new Date(Date.UTC(dataAtual.getUTCFullYear(), dataAtual.getUTCMonth(), 0)).getUTCDate();
  }
  
  document.getElementById("resultado").innerHTML = `Idade: ${anos} anos, ${meses} meses , ${dias} dias`;
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

function criarCheckbox (dose){
    let dosesHtml= []
    if (dose== 0){
        return `<p class="card-p">não tem dose de reforço</p>`
    } else {
        for(let i = 1; i <= dose; i++){
            dosesHtml.push(`<label>
            <input class="card-check" type="checkbox">
            ${i}º dose
            </label>`)
        }
        return dosesHtml.join("")
    }

}

// getVacinas()

  function converterHtml (vacina, doses) {
    return`<div class="card">
      <h3 class="card-h3">${vacina.Vacina}</h3>
      <h4 class="card-h4">Doses</h4>
      <div class="div-check">${criarCheckbox(doses)}</div>
      <h4 class="card-h4">Reforço</h4>
      <div class="div-check">${criarCheckbox(vacina.numeroDosesReforco)}</div>
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
          console.log(vacinasHtml)
          const vacinasContainer = document.getElementById("tabela");
          vacinasContainer.innerHTML = vacinasHtml.join("");
    })
  }

// const cardsVacina = document.getElementById('tabela');
// cardsVacina.style.backgroundColor = '#d9d9d9';
// cardsVacina.style.color = '#000000';
// cardsVacina.elemento.style.fontSize = '20px';
// cardsVacina.style.fontFamily = 'Chivo, sans-serif';
// cardsVacina.style.borderColor = '#006032'
// cardsVacina.style.border = '2px solid #006032'; 
// cardsVacina.style.borderRadius = '5px';
// chackbox?