const nodemailer = require("nodemailer"),
  config = require("../config/mailConfig");
module.exports.mailOptions = function (data, type) {
  if (type === "shareWeather")
    return {
      from: '"priviledger" <no-reply@priviledger.tn>',
      to: data.sentTo.email,
      subject: data.user.name + " is sharing city weather with you ",
      html:
        '<div style="background-color: #f5f8fd;width: 100%;margin-left: auto;margin-right: auto;padding-top: 30px;padding-bottom: 30px;">' +
        '    <div style="padding-top: 10px;margin-bottom: -20px;text-align: center; max-width: 600px;margin-left: auto;margin-right: auto;">' +
        '        <a style="color: black;text-decoration: none;margin-left: 10px;" href="https://priviledger.tn/" target="_blank">' +
        "    </div>" +
        '    <div style="text-align: center;background-color: #ff7400;border-radius: 10px;margin-left: 10px;margin-right: 10px;max-width: 600px;margin-left: auto;margin-right: auto;">' +
        '        <h1 style="color: white; padding: 20px;">' +
        "            City  Name : " +
        data.name +
        "</h1>" +
        "    </div>" +
        '    <div style="text-align: center;background: white; padding-bottom: 45px;padding-top: 20px;max-width: 600px;margin-left: auto;margin-right: auto;">' +
        '        <p style="text-align: left; padding-left:10%;padding-right: 10%;font-size: 18px;"> <b>Nouveau message :</b> ' +
        "        </p>" +
        '        <div style="text-align: left; padding-left:10%;padding-right: 10%;font-size: 18px;">' +
        " Feels like " +
        data.main.feels_like +
        "°C" +
        " " +
        data.weather[0].main +
        " " +
        data.weather[0].description +
        "<br>" +
        "Humidity : " +
        data.main.humidity +
        "%" +
        "<br>" +
        "Pressure : " +
        data.main.pressure +
        "hPa" +
        "<br>" +
        "Wind speed : " +
        data.wind.speed +
        "<br>" +
        "Visibility : " +
        data.visibility +
        "<br>" +
        "        </div>" +
        "    </div>" +
        '    <div style="text-align: center;font-size: 15px;padding-bottom: 10px;padding-top:10px;line-height: 1.5;padding-left:10%;padding-right: 10%;">' +
        '        <span style="">Vous avez des questions? N\'hésitez pas à contacter </span> <br>' +
        '        <a style="text-decoration: none;color: #6fa6f7;" href="https://priviledger.tn" target="_blank">l\'Équipe d\'Assistance priviledger.</a>' +
        "    </div>" +
        "</div>",
    };
};

module.exports.create = () => {
  return nodemailer.createTransport(config.transporter);
};
