const apiSite = "https://www.albion-online-data.com/api/v2/";

function convertDatestamps(array) {
    for (let index = 0; index < array.length; index++) {
        var tmpDate = new Date(array[index]);
        array[index] = moment(tmpDate).format('YYYY-MM-DD');
    }
    return array;
}

function calculateAVGTotal(array) {

}

function validateForm() {

}

var resetCanvas = function(){
    
};

function generateChart() {
    var paramObj = {};
    $.each($('#form').serializeArray(), function(_, kv) {
    if (paramObj.hasOwnProperty(kv.name)) {
        paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
        paramObj[kv.name].push(kv.value);
    }
    else {
        paramObj[kv.name] = kv.value;
    }
    });

    console.log("data",paramObj);
    validateForm(paramObj);
    if(!paramObj.datepicker) {
        var d = new Date();
        d.setDate(d.getDate()-7);
        paramObj.datepicker = d.toISOString();
    }
    
    var url = apiSite+"stats/charts/T"+paramObj.tier+paramObj.item_type+paramObj.enchantment+"?date="+paramObj.datepicker+"&locations="+paramObj.city+"&time-scale=24";
    console.log(url);
    $.get(url,function(data) {
        console.log(data);
        data= data[0].data;
        console.log(data);
        data.timestamps = convertDatestamps(data.timestamps);
        $('#currentChart').remove(); // this is my <canvas> element
        $('#graph-container').append('<canvas id="currentChart"><canvas>');
        var ctx = document.getElementById('currentChart').getContext('2d');

        var chart = new Chart(ctx, {
            type:"bar",
            // The data for our dataset
            data: {
                labels: data.timestamps,
                datasets: [{
                    label: 'Sold amount',
                    data: data.item_count,
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(210,105,30)',
                    yAxisID: 'count-y-axis',
                    type: 'line',
                    order: 1
                } , {
                    label: 'AVG Price',
                    backgroundColor: 'rgb(92,64,51)',
                    borderColor: 'rgb(0, 0, 0)',
                    data: data.prices_avg,
                    type: 'bar',
                    yAxisID: 'price-y-axis',
                    order: 2
                }]
            },

            // Configuration options go here
            options: {
                scales: {
                    yAxes: [{
                        id: 'price-y-axis',
                        type: 'linear'
                    }, {
                        id: 'count-y-axis',
                        type: 'linear'
                    }]
                }
            }
        });
    });
}
