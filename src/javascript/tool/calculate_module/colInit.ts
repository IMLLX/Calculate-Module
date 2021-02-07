/** 列初始化
 *  average(column('test_field_1','test_field_1 > 100')) + test_field_2 + sum(column('test_field_3', 'test_field_3 > 20'))
 */
function colInit(parser: any, data: any) {
  parser.setFunction("column", function (cname: Array<string>) {
    let r: any = [];
    if (cname[1]) {
      if (parser.parse(cname[1]).result) {
        data.forEach((element: any) => {
          r.push(element[cname[0]]);
        });
      } else {
        return 0;
      }
    } else {
      data.forEach((element: any) => {
        r.push(element[cname[0]]);
      });
    }
    return r;
  });
  return parser;
}

export default colInit;
