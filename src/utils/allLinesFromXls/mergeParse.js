export function mergeParse(mergeCells) {
  return mergeCells.reduce((acc,merge/*"A18:A19"*/) => {
      const [,startCol,startRow,endCol,endRow] = /^([A-Z])(\d+):([A-Z])(\d+)$/.exec(merge);
      const sc = startCol.charCodeAt(0);
      const startRowInt = parseInt(startRow);
      const endRowInt = parseInt(endRow);
      const ec = endCol.charCodeAt(0);

      if (endRowInt > startRowInt) {
          const rowSpan = endRowInt - startRowInt +1;//2
          const row = startRowInt -1;
          const column = sc -65;
          acc[row] = {
              ...acc[row],
              [column]:{merge:{rowSpan:rowSpan}}
          };
          if (rowSpan > 1) {
              Array(rowSpan -1).fill('').forEach((_,rowOffset) => {
                  const offset = row + rowOffset +1;
                  acc[offset] = {
                      ... acc[offset],
                      [column]:{style: {display:'none'}}

                  }
              })
          }
      }else if (ec > sc) {
          const colSpan = ec - sc;
          const column = sc -65;
          const row = startRowInt -1;
          acc[row] = {
              ...acc[row],
              [column]:{merge:{colSpan:colSpan +1}}//,style: {textWrap:'nowrap'}
          };
          if (colSpan > 0) {
              Array(colSpan).fill('').forEach((_,colOffset) => {
                  const offset = column + colOffset +1;
                  acc[row] = {
                      ... acc[row],
                      [offset]:{ style: {display:'none'}}

                  }
              })
          }
      }
      return acc;
  },{});
}
