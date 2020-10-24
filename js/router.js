function selectTool(thing) {
    $.when(loadModule($(thing).val()).then(function(html){
        $("#content").html(html);
    }));
}

async function loadModule(moduleName) {
    const result = await $.ajax({
        url: window.location.pathname+"views/"+moduleName+".html"
    });

    return result;
}