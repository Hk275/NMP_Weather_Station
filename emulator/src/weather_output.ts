/* 
    This function returns an object containing six randomised weather data points,
    simulating the raw data output of a weather station. 
    However, each time the function is run, there is a chance that some of the data will be null, 
    or will fall outside the realistic range for that data point (i.e a very large number 
    or a negative number).
    The data points (and their realistic value ranges) are as follows:
     - ambient temperature (0 - 50°C)
     - track temperature (0 - 100°C)
     - humidity (0 - 1)
     - precipitation (0 - 200 mm)
     - wind speed (0 - 100 km/h)
     - wind direction (0 - 360°)
*/
function generate_weather_data() {
    let data_list = [
        Math.random() * 50, 
        Math.random() * 100, 
        Math.random(), 
        Math.random() * 200, 
        Math.random() * 100, 
        Math.random() * 360
    ]
    let rand_pos = getRandomIntInclusive(0, 5);
    let error_chance = getRandomIntInclusive(1, 10);
    let error_value = getRandomIntInclusive(500, 1000);

    switch(error_chance) {
        case 1:
            data_list[rand_pos] = error_value;
            break;
        case 2:
            data_list[rand_pos] = -error_value;
            break;
        case 3:
            data_list[rand_pos] *= -1;
            break;
        case 4:
            data_list[rand_pos] = NaN;
    }
    
    let data_points = {
        "ambient_temp" : data_list[0],
        "track_temp" : data_list[1],
        "humidity" : data_list[2],
        "precipitation" : data_list[3],
        "wind_speed" : data_list[4],
        "wind_dir" : data_list[5],
    }

    return data_points;
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export { generate_weather_data };