/*TODO:*/
// /* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
// /*jshint esversion: 6 */

// let SheetJSImportDirective = function() {
//     return {
//       scope: { },
//       link: function ($scope, $elm, $attrs) {
//         $elm.on('change', function (changeEvent) {
//           let reader = new FileReader();
  
//           reader.onload = function (e) {
//             /* read workbook */
//             let bstr = e.target.result;
//             let workbook = XLSX.read(bstr, {type:'binary'});
  
//             /* DO SOMETHING WITH workbook HERE */
//           };
  
//           reader.readAsBinaryString(changeEvent.target.files[0]);
//         });
//       }
//     };
//   };