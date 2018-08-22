var texts = require("./text/texts.js");
var format = require("./__formatter.js");
var auxils = require("./../auxils.js");

module.exports = async function (game, ended=false) {

  var roles = game.players;
  var client = game.client;
  var config = game.config;

  var log = game.getPeriodLog();

  var guild = client.guilds.get(config["server-id"]);
  var channel = guild.channels.get(log.trial_vote.channel);

  var display_message = await channel.fetchMessage(log.trial_vote.messages[0]);

  if (ended) {
    var message = texts.public_vote_ended;
  } else {
    var message = texts.public_vote;
  };

  message = message.replace("{;public_votes}", getVoteList());

  await display_message.edit(format(game, message));

  function getVoteList () {

    var displays = new Array();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        // Get display role

        // Get people voting against
        var voting_against = roles[i].votes;
        var concat = new Array();

        // Get their display names
        for (var j = 0; j < voting_against.length; j++) {

          // Mapped by IDs
          var member = game.getGuildMember(voting_against[j]);
          concat.push(member.displayName);

        };

        var names = auxils.pettyFormat(concat);

        names = voting_against.length > 0 ? ": " + names : "";

        displays.push("<@" + roles[i].id + "> (" + voting_against.length + "/{!votes_required})" + names);
      } else {
        displays.push("[" + roles[i].alphabet + " - dead, **" + roles[i].getDisplayRole() + "**]");
      };
    };

    return displays.join("\n");

  };

};
