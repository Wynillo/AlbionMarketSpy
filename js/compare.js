const apiSite = "https://www.albion-online-data.com/api/v2/";

function convertDatestamps(array) {
    for (let index = 0; index < array.length; index++) {
        var tmpDate = new Date(array[index]);
        array[index] = moment(tmpDate).format('YYYY-MM-DD');
    }
    return array;
}

async function doAjax(url) {
    console.log("url",url);
    const result = await $.ajax({
        url: url
    });

    return result;
}

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

    if(!paramObj.datepicker) {
        var d = new Date();
        d.setDate(d.getDate()-7);
        paramObj.datepicker = d.toISOString();
    }
    
    var url = apiSite+"stats/charts/T"+paramObj.tier+paramObj.item_type+paramObj.enchantment+"?date="+paramObj.datepicker+"&locations="+paramObj.city+"&time-scale=24";
    var url2 = apiSite+"stats/charts/T"+paramObj.tier+paramObj.item_type+paramObj.enchantment+"?date="+paramObj.datepicker+"&locations="+paramObj.city2+"&time-scale=24";

    $.when(doAjax(url),doAjax(url2)).done(function(d1,d2){
        data= d1[0].data;
        data2= d2[0].data;
        console.log("d1",data);
        console.log("d2",data2);
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
                    label: 'Amount '+paramObj.city,
                    data: data.item_count,
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(102,51,0,0.125)',
                    type: 'line',
                    
                    yAxisID: 'count-y-axis',
                    order: 1
                } , {
                    label: 'AVG Price '+paramObj.city,
                    backgroundColor: 'rgb(102,51,0)',
                    borderColor: 'rgb(0, 0, 0)',
                    data: data.prices_avg,
                    type: 'bar',
                    yAxisID: 'price-y-axis',
                    order: 2
                },{
                    label: 'Amount '+paramObj.city2,
                    data: data2.item_count,
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(0,51,102,0.125)',
                    type: 'line',
                    yAxisID: 'count-y-axis',
                    order: 1
                } , {
                    label: 'AVG Price '+paramObj.city2,
                    backgroundColor: 'rgb(0,51,102)',
                    borderColor: 'rgb(0, 0, 0)',
                    data: data2.prices_avg,
                    yAxisID: 'price-y-axis',
                    type: 'bar',
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
