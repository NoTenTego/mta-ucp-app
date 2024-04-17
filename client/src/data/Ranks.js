/* eslint-disable no-sequences */

const rankNames = {
  admin: [
    { id: 1, title: "Community Manager", color: "#ff0000" },
    { id: 2, title: "Gamemaster", color: "#ff0000" },
    { id: 3, title: "Administrator", color: "#ff0000" },
    { id: 4, title: "Właściciel", color: "#ff0000" },
  ],

  supporter: [
    { id: 1, title: "Supporter", color: "#00ff00" },
    { id: 2, title: "Zarządca Supportu", color: "#ff0000" },
  ],
}

export function getRankName(admin, supporter) {
  if (admin > 0) {
    let rankName = rankNames["admin"][admin - 1].title
    let rankColor = rankNames["admin"][admin - 1].color

    return { rankName, rankColor }
  }

  if (supporter > 0) {
    let rankName = rankNames["supporter"][supporter - 1].title
    let rankColor = rankNames["supporter"][supporter - 1].color

    return { rankName, rankColor }
  }

  let rankName = "Gracz"
  let rankColor = "#ffffff"
  
  return { rankName, rankColor }
}
