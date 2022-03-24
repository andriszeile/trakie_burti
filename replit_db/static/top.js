async function iegutDatusNoApi()
  {
    let datiNoServera = await fetch('/top/rezultati');
    let datiJson = await datiNoServera.json();
    return datiJson;
  }

async function atlasitTop()
{
  let topsJson = await iegutDatusNoApi('topData');
  for (i = 0; i < topsJson.length; i++)
  {
    let tabula = document.querySelector(".tops");
    tabula.innerHTML = tabula.innerHTML+`
    <tr>
    <td> `+topsJson[i]['vards']+` </td>
    <td> `+topsJson[i]['epasts']+` </td>
    <td> `+topsJson[i]['rezultats']+` </td>
    <td> `+topsJson[i]['limenis']+` </td>
    </tr>`;
  }
}
atlasitTop();


