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

function criarCheckbox(dose){
    let dosesHtml= []
    if (dose== 0){
        return `<p>não recomendada dose de reforço</p>`
    } else {
        for(let i = 1; i <= dose; i++){
            dosesHtml.push(`<label>
            <input type="checkbox">
            ${i}º dose
            </label>`)
        }
        return dosesHtml.join("")
    }

}

// getVacinas()

  function converterHtml (vacina, doses) {
    return`<div>
      <h3>${vacina.Vacina}</h3>
      <h4>Doses</h5>
      ${criarCheckbox(doses)}
      <h4>Reforço</h5>
      ${criarCheckbox(vacina.numeroDosesReforco)}
      <p>${vacina.informacaoAdicional ? `${vacina.informacaoAdicional}` : ""}</p>
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