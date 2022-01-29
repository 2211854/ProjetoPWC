$(document).ready( function(){

	//criacao do clone dos campos para os dados das moedas
	const estrutura_dados_moeda = $('.dadosMoeda').clone();
	//variavel dos dados atuais da 
	var dados_atuais_tabela = [];

	var pagina_atual = 'pagina-incial';
	
	
	
	// temporizador para receber e atualizar os dados da api a cada minuto
	let temporizador = setInterval(function(){
		receberDadosAPI();
		atualizarDadosTabela(dados_atuais_tabela);
	}, 7000);


	//fazer com que ao carregar a página dar load nos dados
	$(".table").on('load', receberDadosAPI());

	function atualizarDadosTabela(dados)
	{
	
		$.each(dados, function(index, result){
		    //atualização dos dados na tabela atual
		    $('.market_cap_rank', $('#'+result.id)).html(result.market_cap_rank)
		    $('#logo_moeda', $('#'+result.id)).attr('src', result.image)
		    $('.name', $('#'+result.id)).html(result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    $('.current_price', $('#'+result.id)).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', $('#'+result.id)).html(result.price_change_percentage_24h_in_currency.toFixed(3))
		    $('.price_change_percentage_7d_in_currency', $('#'+result.id)).html(result.price_change_percentage_7d_in_currency.toFixed(3))
		})
	}

	function recriarDadosTabela(dados)
	{
		$('.dadosMoeda').remove();
		$.each(dados, function(index, result){
			var estrutura = estrutura_dados_moeda.clone()

			estrutura.attr('id',result.id)

		    if(pagina_atual == 'favoritos')
		    {
		    	//faz algo	
		    }
		    $('.market_cap_rank', estrutura).html(result.market_cap_rank)
		    $('#logo_moeda', estrutura).attr('src', result.image)
		    $('.name', estrutura).html(result.name + "  <span class='text-muted'>" + result.symbol+"</span>")
		    $('.current_price', estrutura).html(result.current_price+' €')
		    $('.price_change_percentage_24h_in_currency', estrutura).html(result.price_change_percentage_24h_in_currency.toFixed(3))
		    $('.price_change_percentage_7d_in_currency', estrutura).html(result.price_change_percentage_7d_in_currency.toFixed(3))
		    // Adicionar o clone à tabela original
		    $('.table').append(estrutura)
		})
	}


	function receberDadosAPI(){

		//função para atualizar os dados da lista
		$.ajax({
			method: "GET",
			url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
		}).done(function(res){
			if(dados_atuais_tabela.length == 0){ recriarDadosTabela(res)};
			dados_atuais_tabela = duplicarArray(res);
		})
	}

	function organizarDados(categoria){
		var ordem_atual = $("#ordem").html();
		console.log(ordem_atual);

		var dados = duplicarArray(dados_atuais_tabela);

		var dados_auxiliar = [];

		var filtro = categoria+"_";

		if(ordem_atual == "▼")
		{
			filtro +="desc";
		}
		else if (ordem_atual == "▲"){
			filtro +="asc";
		}
		console.log(filtro);
		
		if ( filtro == 'rank_asc') {
			dados_auxiliar = dados;
			$("#ordem").html("▼");
			
		}
		else if (filtro == 'rank_desc')
		{
			$("#ordem").html("▲");
			dados_auxiliar = dados;
			dados_auxiliar.reverse();


		}
		recriarDadosTabela(dados_auxiliar);
	}




	$("#barra_procura").on('focusin', function(e){

		$(this).on('keyup', function(){
			/*for (var i = Things.length - 1; i >= 0; i--) {
				Things[i]
			}*/
			console.log($(this).val());

		});
	});
	
	$("#header_rank").on('click', function (){
		var texto = $(this).text();
		if(texto.indexOf("▼") && texto.indexOf("▲")){
			const ordem = $("#ordem").clone();
			$("#ordem").remove();
			ordem.html("▼");
			$("#header_rank a").append(ordem);
		}

		console.log($(this).text());
		//if ($(this.html() != )) {}
		organizarDados('rank');
	});



	$(".nav-link").on('click', function(e){ 

		$(".active").removeClass('active');
		$(this).addClass('active');
		var referencia = $(this).attr('href');


		if(referencia == "#favoritos"){
			$('h1').html('Moedas definidas como favoritas');
			pagina_atual = "favoritos";
			recriarDadosTabela(dados_atuais_tabela);
		}
		else if(referencia == "#pagina-inicial"){
			$('h1').html('Moedas');
			pagina_atual = "pagina-incial";
			recriarDadosTabela(dados_atuais_tabela);
		}

		$('#titulo').text("Projeto Coingecko | "+pagina_atual);

		$('#dados_moedas').hide();
		$('#dados_moedas').fadeIn(1000);
	});


});


function duplicarArray(arrayOriginal){
	/*criação função Auxiliar para duplicar arrays
	array_duplicada = duplicarArray(arrayOriginal)
	Esta função retorna a array duplicada e faz com que possa ser utilizada sem problemas dos endereços de memória.
	*/

	const duplicada = [];
	for (const i of arrayOriginal) {
	  duplicada.push(i)
	}
	return duplicada;
}