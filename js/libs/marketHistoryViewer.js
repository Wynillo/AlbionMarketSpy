var apiSite = "https://www.albion-online-data.com/api/v2/";

function convertDatestamps(array) {
    for (let index = 0; index < array.length; index++) {
        var tmpDate = new Date(array[index]);
        array[index] = moment(tmpDate).format('YYYY-MM-DD');
    }
    return array;
}

function getCityColours(city) {
    switch (city) {
        case "Caerleon":
            colours = {
                lineBackgroundColor: "rgba(214, 46, 57, 0.1)",
                lineBorderColor: "rgba(214, 46, 57, 0.125)",
                barBackgroundColor: "rgb(214, 46, 57)"
            }
        break;
        case "Martlock":
            colours = {
                lineBackgroundColor: "rgba(91, 117, 145, 0.1)",
                lineBorderColor: "rgba(91, 117, 145, 0.125)",
                barBackgroundColor: "rgb(91, 117, 145)"
            }
        break;
        case "Bridgewatch":
            colours = {
                lineBackgroundColor: "rgba(214, 104, 30, 0.1)",
                lineBorderColor: "rgba(214, 104, 30, 0.125)",
                barBackgroundColor: "rgb(214, 104, 30)"
            }
        break;
        case "Fort Sterling":
            colours = {
                lineBackgroundColor: "rgba(123, 133, 139, 0.1)",
                lineBorderColor: "rgba(123, 133, 139, 0.125)",
                barBackgroundColor: "rgb(123, 133, 139)"
            }
        break;
        case "Lymhurst":
            colours = {
                lineBackgroundColor: "rgba(82, 94, 7, 0.1)",
                lineBorderColor: "rgba(82, 94, 7, 0.125)",
                barBackgroundColor: "rgb(82, 94, 7)"
            }
        break;
        case "Thetfort":
            colours = {
                lineBackgroundColor: "rgba(95, 45, 95, 0.1)",
                lineBorderColor: "rgba(95, 45, 95, 0.125)",
                barBackgroundColor: "rgb(95, 45, 95)"
            }
        break;
        default:
            console.log(city);
            colours = {
                lineBackgroundColor: "rgba(102,51,0,0.1)",
                lineBorderColor: "rgba(102,51,0,0.125)",
                barBackgroundColor: "rgb(102,51,0)"
            }
        break;
    }
    return colours;
}

async function doAjax(url, marketHistoryModel) {
    const result = await $.ajax({
        url: `${url}stats/charts/${marketHistoryModel.getItemId()}`,
        data: {
            locations: marketHistoryModel.locations,
            date:marketHistoryModel.date,
            'time-scale':marketHistoryModel.time_scale
        }
    });
    console.log("result",result);
    return result;
}

 function generateChartData(returnData) {
    console.log("returnData",returnData);
    datasets = [];
    timestamps = [];
    for (let index = 0; index < returnData.length; index++) {
        const marketHistory = returnData[index];
        marketHistory.data.timestamps = convertDatestamps(marketHistory.data.timestamps);
        if(timestamps.length < marketHistory.data.timestamps.length) {
            timestamps = marketHistory.data.timestamps;
        }
        console.log(`marketHistory ${index}`,marketHistory);
        var colours = getCityColours(marketHistory.location);
        datasets.push({
            label: 'Amount '+marketHistory.location,
            data: marketHistory.data.item_count,
            backgroundColor: colours.lineBackgroundColor,
            borderColor: colours.lineBorderColor,
            type: 'line',
            yAxisID: 'count-y-axis',
            order: 1
        });

        datasets.push({
            label: 'AVG Price '+marketHistory.location,
            backgroundColor: colours.barBackgroundColor,
            borderColor: 'rgb(0, 0, 0)',
            data: marketHistory.data.prices_avg,
            type: 'bar',
            yAxisID: 'price-y-axis',
            order: 2
        });
    }

    return {
        timestamps: timestamps,
        datasets: datasets
    };
}

function loadFormData() {
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

    return paramObj;
}

function generateChart() {
    paramObj = loadFormData();

    if(!paramObj.datepicker) {
        var d = new Date();
        d.setDate(d.getDate()-7);
        paramObj.datepicker = d.toISOString();
    }
    
    console.log("paramObj",paramObj);

    var history1 = new MarketHistory(
        paramObj.tier,
        paramObj.item_type,
        paramObj.enchantment,
        paramObj.datepicker,
        `${paramObj.city1},${paramObj.city2}`
    );
    
    doAjax(apiSite,history1).then(function(data) {
        chartData =  generateChartData(data);
        console.log("chartData",chartData);
        $('#currentChart').remove(); // this is my <canvas> element
        $('#graph-container').append('<canvas id="currentChart"><canvas>');
        var ctx = document.getElementById('currentChart').getContext('2d');

        var chart = new Chart(ctx, {
            type:"bar",

            // The data for our dataset
            data: {
                labels: chartData.timestamps,
                datasets: chartData.datasets
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

$(function () {
    var d = new Date();
    d.setDate(d.getDate()-7);
    $('.input-group.date').datepicker({format: "m-d-yyyy",todayBtn: "linked"});

    console.log("huh?");
    generateChart();
});
