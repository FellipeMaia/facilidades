class MakeTable{
//var botao = '<button class="btn btn-success"><i class="fas fa-eye"></i></button>';

constructor(id) {
this.botao = null;
this.tableCampos = null;

this.idTable = id;
this.idTableNav = this.idTable+"-nav";
this.idTableSelect = this.idTable+"-select";
this.idTableElement = this.idTable+"-elemente";

this.select = '<div class="justify-content-start">'+
               '<select class="custom-select" id="'+this.idTableSelect+'" style="width:75px" >'+
                   '<option value="5">5</option>'+
                   '<option value="10">10</option>'+
                   '<option value="25">25</option>'+
                   '<option value="50">50</option>'+
                   '<option value="100">100</option>'+
               '</select>';
            '</div>'

this.nav =  '<nav id="'+this.idTableNav+'" aria-label="Page navigation example" >'+
               '<ul class="pagination justify-content-end"></ul>'+
               '</ul>'+
           '</nav>';

this.listTable = '<div><table id="'+this.idTableElement+'" class="table"></table></div>';

this.idTable = '#'+this.idTable;
this.idTableNav = '#'+this.idTableNav;
this.idTableSelect = '#'+this.idTableSelect;
this.idTableElement = '#'+this.idTableElement;


this.makePaginassao();

}

// essa função adiciona dinamicamente os elementos do JSON ao Table          
carregarTabela(teste,campos = this.tableCampos,verBotao = this.botao) {
this.tableDados = teste;
this.tableCampos = campos;
this.botao = verBotao;
console.log('carregarTabela');
$(this.idTable).find('thead').remove();
$(this.idTable).find('tbody').remove();
var linha;
var keysCampos = Object.keys(campos);
var keysDados = Object.keys(teste[0]);
   $(this.idTable).append('<thead><tr></tr></thead>');
   for(var i=1;i<keysCampos.length;i++){
       linha += '<th scope="col" rel='+keysDados[i]+'>'+MakeTable.getter(campos,keysCampos[i])+'</th>';
   }
   linha += '<th scope="col"></th>';
   $(this.idTable+" thead tr").append(linha);
   $(this.idTable).append('<tbody></tbody>');
   //Proximo passo é adicionar o cabeçalho da tabela aqui
   for(var j=0;j<teste.length;j++) {
       var row = teste[j];
       linha = '<tr id="'+MakeTable.getter(row,keysDados[0])+'">';
       for(var i=1;i<keysCampos.length;i++){
           linha = linha + '<td rel="'+MakeTable.getter(campos,keysCampos[i])+'">'+MakeTable.getter(row,keysCampos[i])+"</td>";
       }
       if(verBotao != null){
        linha = linha + '<td>'+verBotao.replace("###",j.toString())+'</td>';
       }
       linha = linha + "</tr>";
       $(this.idTable+" tbody").append(linha);
   };
   
   $(this.idTableSelect).trigger('change');
   $('body').trigger('resize');

}

carregarTabelaSemCabecalho(campos,teste) {
$(this.idTable).find('thead').remove();
$(this.idTable).find('tbody').remove();
   var linha;
   $(this.idTable).append('<tbody></tbody>');
   var keys = Object.keys(teste[0]);
   for(var j=0;j<teste.length;j++) {
       var row = teste[j];
       linha = '<tr id="'+MakeTable.getter(row,keys[0])+'">';
       for(var i=1;i<campos.length;i++){
           linha = linha + '<td rel="'+campos[i]+'">'+MakeTable.getter(row,keys[i])+"</td>";
       }
       linha = linha + "</tr>";
       $(this.idTable+" tbody").append(linha);
   };
   
   $(this.idTableSelect).trigger('change');
   $('body').trigger('resize');

}

getDados(index){
return this.tableDados[index];
}

addInTable(json) {
console.log('addTable');
this.tableDados.push(json);
this.carregarTabela(this.tableCampos,this.tableDados,this.botao);


}

makePaginassao() {

$(this.idTableNav).remove();
$(this.idTableSelect).remove();

   $(this.idTable).before(this.select);
   $(this.idTable).after(this.nav);
   
   var _idTable = this.idTable;
var _idTableNav = this.idTableNav;
var _idTableSelect = this.idTableSelect;
var _idTableElement = this.idTableElement;

   // o elemento Seledt do HTML redimenciona a qauntidade de linhas exibidas na pagina
   $(_idTableSelect).change(function(e){
       e.preventDefault();
       //Remove os os indicadores de paginas no final da tabela
       $(_idTableNav+' ul').find('li').remove();
       // Verifica de linha, a quant. paginas selecionadas e calcula quantas vão ser exibidas
       var rowsShown = parseInt($(_idTableSelect).val());
       var rowsTotal = $(_idTable+' tbody tr').length;
       if(rowsShown>rowsTotal)
           rowsTotal = rowsShown;
       var numPages = rowsTotal/rowsShown;
       //=========
       //Adiciona a paginação no final da tabela com a nova quantidade
       for(var i = 0;i < numPages;i++) {
           var pageNum = i + 1;
           $(_idTableNav+' ul').append('<li class="page-item"><a class="page-link" rel="'+i+'" href="#">'+pageNum+'</a></li>');
       }
       //====== Oculta todas as linha da tabela e exibe somente as da primeira pagina
       $(_idTable+' tbody tr').hide();
       $(_idTable+' tbody tr').slice(0, rowsShown).show();
       $(_idTableNav+' a:first').addClass('active');
       //======

       // Esse evento é adicionado as tag <a> criado recentemente no evento change
       $(_idTableNav+' ul li a').bind('click', function(e){
           e.preventDefault();
           //====== remove a classe da tag <a> anterior e adiciona na atual
           $(_idTableNav+' ul li a').removeClass('active');
           $(this).addClass('active');
           //=======
           //======= Define a pagina que ira exibir as linha referente a tag selecionada
           var currPage = $(this).attr('rel');
           var startItem = currPage * rowsShown;
           var endItem = startItem + rowsShown;
           $(_idTable+' tbody tr').hide().slice(startItem, endItem).
               css('display','table-row').animate({opacity:1}, 300);
           //=======
       });
   });

   // chama o evento Change para criar a primeira paginação.
   $(this.idTableSelect).trigger('change');
   $('body').trigger('resize');


}


addListTable(numeroColunas){
   $(this.idTable+" tr").click(function(e) {
       console.log($(this).find(this.idTableElement));
       if($(this).find(this.idTableElement).length == 0){
           removeListTable();
           $(this).after(listTable);
           var arr = jQuery.makeArray( $(this).find('td') );
           for(var i = numeroColunas;i<$(this.idTable+' thead tr th').length;i++){
               $(this.idTableElement).append('<tr><td>'+$(arr[i]).attr('rel')+'</td><td>'+$(arr[i]).text()+'</td></tr>');
           }
       }else{
           removeListTable();
       }
    });
}

removeEvent(){
   $(idTable+" tr").unbind('click');
}

removeListTable(){
   $(idTable+' tbody').find(idTableElement).remove();
}

static getter(object,key){
   for (var prop in object) {
       if (object.hasOwnProperty(prop)) {
           if(key == prop){
               return object[prop];
           }
       }
   }
}

}

/*

//só acontece se alterar o tamanho, que ser execudado quando abre a pagina porra!!!!!
$(window).on('resize', function() {
    var win = $(this);
    var width = win.width();
    if(width < 768){
        responsive(3);
        addListTable(3);
    }else{
        removeListTable();
        removeEvent();
        responsive($(idTable+' thead tr th').length);
    }
});

function responsive(numeroColunas){
    $(idTable+' thead tr th').hide();
    $(idTable+' tbody tr td').hide();
    $(idTable+' thead tr th').slice(0, numeroColunas).show();
    for(var i=1;i<=numeroColunas;i++){
        $(idTable+' td:nth-child('+i+')').show();
    }
}*/
