


$(document).ready(function(){

	//criacao do clone dos campos para os dados das moedas
	var estrutura_dados_moeda = $('.dadosMoeda').clone();
	//variavel dos dados atuais da 
	var dados_atuais_tabela = [];

	var pagina_atual = 'pagina-incial';


	$('.table').on('load', receberDadosAPI(pagina_atual))


	function atualizarDadosTabela(dados)
	{
		$.each(dados, function(index, result){
				var estrutura = estrutura_dados_moeda.clone()

				estrutura.attr('id',result.id)
			    // Alterar no clone
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
		$('.dadosMoeda').remove();
		$.ajax({
			method: "GET",
			url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
		}).done(function(res){
			dados_atuais_tabela = res;
			console.log(dados_atuais_tabela);

			atualizarDadosTabela(res);
			
		})
	}

	function organizarDados(filtro){
		if ( filtro == 'rank_asc') {
			var dados_auxiliar = [];
			for (var i = 0 ; i <= dados_atuais_tabela.length ; i++) {
				if(dados_atuais_tabela[i].market_cap_rank == i+1)
				{
					dados_auxiliar[i] = dados_atuais_tabela[i];
				}
			}
			atualizarDadosTabela(dados_auxiliar,'pagina-incial');
		}
	}




	$("#barra_procura").on('focusin', function(e){

		$(this).on('keyup', function(){
			/*for (var i = Things.length - 1; i >= 0; i--) {
				Things[i]
			}*/

		});
	});
	


	$(".nav-link").on('click', function(e){ 

		$(".active").removeClass('active');
		$(this).addClass('active');
		var referencia = $(this).attr('href');


		if(referencia == "#favoritos"){
			$('h1').html('Moedas definidas como favoritas');
			pagina_atual = "favoritos";
			atualizarDadosTabela(dados_atuais_tabela);
		}
		else if(referencia == "#pagina-inicial"){
			$('h1').html('Moedas');
			pagina_atual = "pagina-incial";
			atualizarDadosTabela(dados_atuais_tabela);
		}

		$('#titulo').text("Projeto Coingecko | "+pagina_atual);

		$('#dados_moedas').hide();
		$('#dados_moedas').fadeIn(1000);
	});

});