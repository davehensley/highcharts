$(function () {

    QUnit.test('Extremes after Axis update', function (assert) {

        var data = [[1214352000000,25.34],[1214438400000,24.04],[1214524800000,24.3],[1214784000000,23.92],[1214870400000,24.95],[1214956800000,24.03],[1215043200000,24.3],[1215388800000,25.02],[1215475200000,25.65],[1215561600000,24.89],[1215648000000,25.23],[1215734400000,24.65],[1215993600000,24.84],[1216080000000,24.23],[1216166400000,24.69],[1216252800000,24.54],[1216339200000,23.59],[1216598400000,23.76],[1216684800000,23.15],[1216771200000,23.75],[1216857600000,22.72],[1216944000000,23.16],[1217203200000,22.06],[1217289600000,22.44],[1217376000000,22.84],[1217462400000,22.71],[1217548800000,22.38],[1217808000000,21.89],[1217894400000,22.95],[1217980800000,23.46],[1218067200000,23.37],[1218153600000,24.22],[1218412800000,24.79],[1218499200000,25.25],[1218585600000,25.61],[1218672000000,25.62],[1218758400000,25.11],[1219017600000,25.06],[1219104000000,24.79],[1219190400000,25.12],[1219276800000,24.9],[1219363200000,25.26],[1219622400000,24.65],[1219708800000,24.81],[1219795200000,24.95],[1219881600000,24.82],[1219968000000,24.22],[1220313600000,23.74],[1220400000000,23.85],[1220486400000,23.03],[1220572800000,22.88],[1220832000000,22.56],[1220918400000,21.67],[1221004800000,21.66],[1221091200000,21.81],[1221177600000,21.28],[1221436800000,20.05],[1221523200000,19.98],[1221609600000,18.26],[1221696000000,19.16],[1221782400000,20.13],[1222041600000,18.72],[1222128000000,18.12],[1222214400000,18.39],[1222300800000,18.85],[1222387200000,18.32],[1222646400000,15.04],[1222732800000,16.24],[1222819200000,15.59],[1222905600000,14.3],[1222992000000,13.87],[1223251200000,14.02],[1223337600000,12.74],[1223424000000,12.83],[1223510400000,12.68],[1223596800000,13.8],[1223856000000,15.75],[1223942400000,14.87],[1224028800000,13.99],[1224115200000,14.56],[1224201600000,13.91],[1224460800000,14.06],[1224547200000,13.07],[1224633600000,13.84],[1224720000000,14.03],[1224806400000,13.77],[1225065600000,13.16],[1225152000000,14.27],[1225238400000,14.94],[1225324800000,15.86],[1225411200000,15.37],[1225670400000,15.28],[1225756800000,15.86],[1225843200000,14.76],[1225929600000,14.16],[1226016000000,14.03],[1226275200000,13.7],[1226361600000,13.54],[1226448000000,12.87],[1226534400000,13.78],[1226620800000,12.89],[1226880000000,12.59],[1226966400000,12.84],[1227052800000,12.33],[1227139200000,11.5],[1227225600000,11.8],[1227484800000,13.28],[1227571200000,12.97],[1227657600000,13.57],[1227830400000,13.24],[1228089600000,12.7],[1228176000000,13.21],[1228262400000,13.7],[1228348800000,13.06],[1228435200000,13.43],[1228694400000,14.25],[1228780800000,14.29],[1228867200000,14.03],[1228953600000,13.57],[1229040000000,14.04],[1229299200000,13.54],[1229385600000,13.63],[1229472000000,12.74],[1229558400000,12.78],[1229644800000,12.86],[1229904000000,12.25],[1229990400000,12.34],[1230076800000,12.15],[1230249600000,12.26],[1230508800000,12.37],[1230595200000,12.33],[1230681600000,12.19],[1230854400000,12.96],[1231113600000,13.51],[1231200000000,13.29],[1231286400000,13],[1231372800000,13.24],[1231459200000,12.94],[1231718400000,12.67],[1231804800000,12.53],[1231891200000,12.19],[1231977600000,11.91],[1232064000000,11.76],[1232409600000,11.17],[1232496000000,11.83],[1232582400000,12.62],[1232668800000,12.62],[1232928000000,12.81],[1233014400000,12.96],[1233100800000,13.46],[1233187200000,13.29],[1233273600000,12.88],[1233532800000,13.07],[1233619200000,13.28],[1233705600000,13.36],[1233792000000,13.78],[1233878400000,14.25],[1234137600000,14.64],[1234224000000,13.98],[1234310400000,13.83],[1234396800000,14.18],[1234483200000,14.17],[1234828800000,13.5],[1234915200000,13.48],[1235001600000,12.95],[1235088000000,13],[1235347200000,12.42],[1235433600000,12.89],[1235520000000,13.02],[1235606400000,12.74],[1235692800000,12.76],[1235952000000,12.56],[1236038400000,12.62],[1236124800000,13.02],[1236211200000,12.69],[1236297600000,12.19],[1236556800000,11.87],[1236643200000,12.66],[1236729600000,13.24],[1236816000000,13.76],[1236902400000,13.7],[1237161600000,13.63],[1237248000000,14.24],[1237334400000,14.5],[1237420800000,14.52],[1237507200000,14.51],[1237766400000,15.38],[1237852800000,15.21],[1237939200000,15.21],[1238025600000,15.7],[1238112000000,15.26],[1238371200000,14.93],[1238457600000,15.02],[1238544000000,15.53],[1238630400000,16.1],[1238716800000,16.57],[1238976000000,16.92],[1239062400000,16.43],[1239148800000,16.62],[1239235200000,17.08],[1239580800000,17.17],[1239667200000,16.9],[1239753600000,16.81],[1239840000000,17.35],[1239926400000,17.63],[1240185600000,17.21],[1240272000000,17.39],[1240358400000,17.36],[1240444800000,17.91],[1240531200000,17.7],[1240790400000,17.82],[1240876800000,17.7],[1240963200000,17.88],[1241049600000,17.98],[1241136000000,18.18],[1241395200000,18.87],[1241481600000,18.96],[1241568000000,18.93],[1241654400000,18.44],[1241740800000,18.46],[1242000000000,18.51],[1242086400000,17.77],[1242172800000,17.07],[1242259200000,17.56],[1242345600000,17.49],[1242604800000,18.09],[1242691200000,18.21],[1242777600000,17.98],[1242864000000,17.74],[1242950400000,17.5],[1243296000000,18.68],[1243382400000,19.01],[1243468800000,19.3],[1243555200000,19.4],[1243814400000,19.91],[1243900800000,19.93],[1243987200000,20.14],[1244073600000,20.53],[1244160000000,20.67],[1244419200000,20.55],[1244505600000,20.39],[1244592000000,20.04],[1244678400000,19.99],[1244764800000,19.57],[1245024000000,19.44],[1245110400000,19.48],[1245196800000,19.37],[1245283200000,19.41],[1245369600000,19.93],[1245628800000,19.62],[1245715200000,19.14],[1245801600000,19.46],[1245888000000,19.98],[1245974400000,20.35],[1246233600000,20.28],[1246320000000,20.35],[1246406400000,20.4],[1246492800000,20],[1246838400000,19.8],[1246924800000,19.34],[1247011200000,19.6],[1247097600000,19.48],[1247184000000,19.79],[1247443200000,20.33],[1247529600000,20.32],[1247616000000,20.98],[1247702400000,21.07],[1247788800000,21.68],[1248048000000,21.84],[1248134400000,21.64],[1248220800000,22.39],[1248307200000,22.55],[1248393600000,22.86],[1248652800000,22.87],[1248739200000,22.86],[1248825600000,22.86],[1248912000000,23.26],[1248998400000,23.34],[1249257600000,23.78],[1249344000000,23.65],[1249430400000,23.59],[1249516800000,23.42],[1249603200000,23.64],[1249862400000,23.53],[1249948800000,23.26],[1250035200000,23.62],[1250121600000,24.06],[1250208000000,23.83],[1250467200000,22.8],[1250553600000,23.43],[1250640000000,23.51],[1250726400000,23.76],[1250812800000,24.17],[1251072000000,24.15],[1251158400000,24.2],[1251244800000,23.92],[1251331200000,24.21],[1251417600000,24.29],[1251676800000,24.03],[1251763200000,23.61],[1251849600000,23.6],[1251936000000,23.79],[1252022400000,24.33],[1252368000000,24.7],[1252454400000,24.45],[1252540800000,24.65],[1252627200000,24.59],[1252886400000,24.82],[1252972800000,25.02],[1253059200000,25.98],[1253145600000,26.36],[1253232000000,26.43],[1253491200000,26.29],[1253577600000,26.35],[1253664000000,26.5],[1253750400000,26.26],[1253836800000,26.05],[1254096000000,26.59],[1254182400000,26.48],[1254268800000,26.48],[1254355200000,25.84],[1254441600000,26.41],[1254700800000,26.57],[1254787200000,27.14],[1254873600000,27.18],[1254960000000,27.04],[1255046400000,27.21],[1255305600000,27.26],[1255392000000,27.15],[1255478400000,27.33],[1255564800000,27.22],[1255651200000,26.86],[1255910400000,27.12],[1255996800000,28.39],[1256083200000,29.27],[1256169600000,29.31],[1256256000000,29.13],[1256515200000,28.93],[1256601600000,28.2],[1256688000000,27.49],[1256774400000,28.05],[1256860800000,26.93],[1257120000000,27.04],[1257206400000,26.96],[1257292800000,27.26],[1257379200000,27.72],[1257465600000,27.76],[1257724800000,28.78],[1257811200000,29],[1257897600000,29.04],[1257984000000,28.86],[1258070400000,29.21],[1258329600000,29.52],[1258416000000,29.57],[1258502400000,29.42],[1258588800000,28.64],[1258675200000,28.56],[1258934400000,29.41],[1259020800000,29.21],[1259107200000,29.17],[1259280000000,28.66],[1259539200000,28.56],[1259625600000,28.14],[1259712000000,28.03],[1259798400000,28.07],[1259884800000,27.62],[1260144000000,26.99],[1260230400000,27.12],[1260316800000,28.26],[1260403200000,28.06],[1260489600000,27.81],[1260748800000,28.14],[1260835200000,27.74],[1260921600000,27.86],[1261008000000,27.41],[1261094400000,27.92],[1261353600000,28.32],[1261440000000,28.62],[1261526400000,28.87],[1261612800000,29.86],[1261958400000,30.23],[1262044800000,29.87],[1262131200000,30.23],[1262217600000,30.1],[1262563200000,30.57],[1262649600000,30.63],[1262736000000,30.14],[1262822400000,30.08],[1262908800000,30.28],[1263168000000,30.02],[1263254400000,29.67],[1263340800000,30.09],[1263427200000,29.92],[1263513600000,29.42],[1263859200000,30.72],[1263945600000,30.25],[1264032000000,29.72],[1264118400000,28.25],[1264377600000,29.01],[1264464000000,29.42],[1264550400000,29.7],[1264636800000,28.47],[1264723200000,27.44],[1264982400000,27.82],[1265068800000,27.98],[1265155200000,28.46],[1265241600000,27.44],[1265328000000,27.92],[1265587200000,27.73],[1265673600000,28.03],[1265760000000,27.87],[1265846400000,28.38],[1265932800000,28.63],[1266278400000,29.06],[1266364800000,28.94],[1266451200000,28.99],[1266537600000,28.81],[1266796800000,28.63],[1266883200000,28.15],[1266969600000,28.66],[1267056000000,28.86],[1267142400000,29.23],[1267401600000,29.86],[1267488000000,29.84],[1267574400000,29.9],[1267660800000,30.1],[1267747200000,31.28],[1268006400000,31.3],[1268092800000,31.86],[1268179200000,32.12],[1268265600000,32.21],[1268352000000,32.37],[1268611200000,31.98],[1268697600000,32.06],[1268784000000,32.02],[1268870400000,32.09],[1268956800000,31.75],[1269216000000,32.11],[1269302400000,32.62],[1269388800000,32.77],[1269475200000,32.38],[1269561600000,32.99],[1269820800000,33.2],[1269907200000,33.69],[1269993600000,33.57],[1270425600000,34.07],[1270512000000,34.22],[1270598400000,34.37],[1270684800000,34.28],[1270771200000,34.54],[1271030400000,34.61],[1271116800000,34.63],[1271203200000,35.1],[1271289600000,35.56],[1271376000000,35.34],[1271635200000,35.3],[1271721600000,34.94],[1271808000000,37.03],[1271894400000,38.07],[1271980800000,38.69],[1272240000000,38.5],[1272326400000,37.43],[1272412800000,37.37],[1272499200000,38.38],[1272585600000,37.3],[1272844800000,38.05],[1272931200000,36.95],[1273017600000,36.57],[1273104000000,35.18],[1273190400000,33.69],[1273449600000,36.28],[1273536000000,36.65],[1273622400000,37.44],[1273708800000,36.91],[1273795200000,36.26],[1274054400000,36.32],[1274140800000,36.05],[1274227200000,35.48],[1274313600000,33.97],[1274400000000,34.62],[1274659200000,35.25],[1274745600000,35.03],[1274832000000,34.87],[1274918400000,36.19],[1275004800000,36.7],[1275350400000,37.26],[1275436800000,37.71],[1275523200000,37.59],[1275609600000,36.57],[1275868800000,35.85],[1275955200000,35.62],[1276041600000,34.74],[1276128000000,35.79],[1276214400000,36.22],[1276473600000,36.33],[1276560000000,37.1],[1276646400000,38.18],[1276732800000,38.84],[1276819200000,39.15],[1277078400000,38.6],[1277164800000,39.12],[1277251200000,38.71],[1277337600000,38.43],[1277424000000,38.1],[1277683200000,38.33],[1277769600000,36.6],[1277856000000,35.93],[1277942400000,35.5],[1278028800000,35.28],[1278374400000,35.52],[1278460800000,36.95],[1278547200000,36.87],[1278633600000,37.09],[1278892800000,36.76],[1278979200000,35.97],[1279065600000,36.1],[1279152000000,35.92],[1279238400000,35.7],[1279497600000,35.08],[1279584000000,35.98],[1279670400000,36.32],[1279756800000,37],[1279843200000,37.13],[1280102400000,37.04],[1280188800000,37.73],[1280275200000,37.28],[1280361600000,36.87],[1280448000000,36.75],[1280707200000,37.41],[1280793600000,37.42],[1280880000000,37.57],[1280966400000,37.39],[1281052800000,37.16],[1281312000000,37.39],[1281398400000,37.06],[1281484800000,35.74],[1281571200000,35.97],[1281657600000,35.59],[1281916800000,35.38],[1282003200000,36],[1282089600000,36.15],[1282176000000,35.7],[1282262400000,35.66],[1282521600000,35.11],[1282608000000,34.28],[1282694400000,34.7],[1282780800000,34.33],[1282867200000,34.52],[1283126400000,34.64],[1283212800000,34.73],[1283299200000,35.76],[1283385600000,36.02],[1283472000000,36.97],[1283817600000,36.83],[1283904000000,37.56],[1283990400000,37.58],[1284076800000,37.63],[1284336000000,38.15],[1284422400000,38.29],[1284508800000,38.6],[1284595200000,39.51],[1284681600000,39.34],[1284940800000,40.46],[1285027200000,40.54],[1285113600000,41.11],[1285200000000,41.27],[1285286400000,41.76],[1285545600000,41.6],[1285632000000,40.98],[1285718400000,41.05],[1285804800000,40.54],[1285891200000,40.36],[1286150400000,39.81],[1286236800000,41.28],[1286323200000,41.31],[1286409600000,41.32],[1286496000000,42.01],[1286755200000,42.19],[1286841600000,42.65],[1286928000000,42.88],[1287014400000,43.19],[1287100800000,44.96],[1287360000000,45.43],[1287446400000,44.21],[1287532800000,44.36],[1287619200000,44.22],[1287705600000,43.92],[1287964800000,44.12],[1288051200000,44.01],[1288137600000,43.98],[1288224000000,43.61],[1288310400000,43],[1288569600000,43.45],[1288656000000,44.19],[1288742400000,44.69],[1288828800000,45.47],[1288915200000,45.3],[1289174400000,45.52],[1289260800000,45.15],[1289347200000,45.43],[1289433600000,45.24],[1289520000000,44],[1289779200000,43.86],[1289865600000,43.08],[1289952000000,42.93],[1290038400000,44.06],[1290124800000,43.82],[1290384000000,44.77],[1290470400000,44.1],[1290556800000,44.97],[1290729600000,45],[1290988800000,45.27],[1291075200000,44.45],[1291161600000,45.2],[1291248000000,45.45],[1291334400000,45.35],[1291593600000,45.74],[1291680000000,45.46],[1291766400000,45.86],[1291852800000,45.68],[1291939200000,45.79],[1292198400000,45.95],[1292284800000,45.76],[1292371200000,45.77],[1292457600000,45.89],[1292544000000,45.8],[1292803200000,46.03],[1292889600000,46.32],[1292976000000,46.45],[1293062400000,46.23],[1293408000000,46.38],[1293494400000,46.5],[1293580800000,46.47],[1293667200000,46.24],[1293753600000,46.08],[1294012800000,47.08],[1294099200000,47.33],[1294185600000,47.71],[1294272000000,47.68],[1294358400000,48.02],[1294617600000,48.92],[1294704000000,48.81],[1294790400000,49.2],[1294876800000,49.38],[1294963200000,49.78],[1295308800000,48.66],[1295395200000,48.41],[1295481600000,47.53],[1295568000000,46.67],[1295827200000,48.21],[1295913600000,48.77],[1296000000000,49.12],[1296086400000,49.03],[1296172800000,48.01],[1296432000000,48.47],[1296518400000,49.29],[1296604800000,49.19],[1296691200000,49.06],[1296777600000,49.5],[1297036800000,50.27],[1297123200000,50.74],[1297209600000,51.17],[1297296000000,50.65],[1297382400000,50.98],[1297641600000,51.31],[1297728000000,51.41],[1297814400000,51.88],[1297900800000,51.19],[1297987200000,50.08],[1298332800000,48.37],[1298419200000,48.95],[1298505600000,48.98],[1298592000000,49.74],[1298851200000,50.46],[1298937600000,49.9],[1299024000000,50.3],[1299110400000,51.37],[1299196800000,51.43],[1299456000000,50.77],[1299542400000,50.82],[1299628800000,50.35],[1299715200000,49.52],[1299801600000,50.28],[1300060800000,50.51],[1300147200000,49.35],[1300233600000,47.14],[1300320000000,47.81],[1300406400000,47.24],[1300665600000,48.47],[1300752000000,48.74],[1300838400000,48.46],[1300924800000,49.28],[1301011200000,50.22],[1301270400000,50.06],[1301356800000,50.14],[1301443200000,49.8],[1301529600000,49.79],[1301616000000,49.22],[1301875200000,48.74],[1301961600000,48.41],[1302048000000,48.29],[1302134400000,48.3],[1302220800000,47.87],[1302480000000,47.26],[1302566400000,47.49],[1302652800000,48.02],[1302739200000,47.49],[1302825600000,46.78],[1303084800000,47.41],[1303171200000,48.27],[1303257600000,48.92],[1303344000000,50.1],[1303689600000,50.43],[1303776000000,50.06],[1303862400000,50.02],[1303948800000,49.54],[1304035200000,50.02],[1304294400000,49.47],[1304380800000,49.74],[1304467200000,49.94],[1304553600000,49.54],[1304640000000,49.52],[1304899200000,49.66],[1304985600000,49.92],[1305072000000,49.6],[1305158400000,49.51],[1305244800000,48.64],[1305504000000,47.61],[1305590400000,48.02],[1305676800000,48.55],[1305763200000,48.65],[1305849600000,47.89],[1306108800000,47.77],[1306195200000,47.46],[1306281600000,48.11],[1306368000000,47.86],[1306454400000,48.2],[1306800000000,49.69],[1306886400000,49.36],[1306972800000,49.44],[1307059200000,49.06],[1307318400000,48.29],[1307404800000,47.43],[1307491200000,47.46],[1307577600000,47.36],[1307664000000,46.56],[1307923200000,46.66],[1308009600000,47.49],[1308096000000,46.68],[1308182400000,46.45],[1308268800000,45.75],[1308528000000,45.05],[1308614400000,46.47],[1308700800000,46.09],[1308787200000,47.32],[1308873600000,46.62],[1309132800000,47.43],[1309219200000,47.89],[1309305600000,47.72],[1309392000000,47.95],[1309478400000,49.04],[1309824000000,49.92],[1309910400000,50.25],[1309996800000,51.03],[1310083200000,51.39],[1310342400000,50.57],[1310428800000,50.54],[1310515200000,51.15],[1310601600000,51.11],[1310688000000,52.13],[1310947200000,53.4],[1311033600000,53.84],[1311120000000,55.27],[1311206400000,55.33],[1311292800000,56.19],[1311552000000,56.93],[1311638400000,57.63],[1311724800000,56.08],[1311811200000,55.97],[1311897600000,55.78],[1312156800000,56.68],[1312243200000,55.46],[1312329600000,56.08],[1312416000000,53.91],[1312502400000,53.37],[1312761600000,50.46],[1312848000000,53.43],[1312934400000,51.96],[1313020800000,53.39],[1313107200000,53.86],[1313366400000,54.77],[1313452800000,54.35],[1313539200000,54.35],[1313625600000,52.29],[1313712000000,50.86],[1313971200000,50.92],[1314057600000,53.37],[1314144000000,53.74],[1314230400000,53.39],[1314316800000,54.8],[1314576000000,55.71],[1314662400000,55.71],[1314748800000,54.98],[1314835200000,54.43],[1314921600000,53.44],[1315267200000,54.25],[1315353600000,54.85],[1315440000000,54.88],[1315526400000,53.93],[1315785600000,54.28],[1315872000000,54.95],[1315958400000,55.61],[1316044800000,56.14],[1316131200000,57.21],[1316390400000,58.8],[1316476800000,59.06],[1316563200000,58.88],[1316649600000,57.4],[1316736000000,57.76],[1316995200000,57.6],[1317081600000,57.04],[1317168000000,56.72],[1317254400000,55.8],[1317340800000,54.47],[1317600000000,53.51],[1317686400000,53.21],[1317772800000,54.04],[1317859200000,53.91],[1317945600000,52.83],[1318204800000,55.54],[1318291200000,57.18],[1318377600000,57.46],[1318464000000,58.35],[1318550400000,60.29],[1318809600000,60],[1318896000000,60.32],[1318982400000,56.95],[1319068800000,56.47],[1319155200000,56.12],[1319414400000,57.97],[1319500800000,56.82],[1319587200000,57.23],[1319673600000,57.81],[1319760000000,57.85],[1320019200000,57.83],[1320105600000,56.64],[1320192000000,56.77],[1320278400000,57.58],[1320364800000,57.18],[1320624000000,57.1],[1320710400000,58.03],[1320796800000,56.47],[1320883200000,55.03],[1320969600000,54.95],[1321228800000,54.18],[1321315200000,55.55],[1321401600000,54.97],[1321488000000,53.92],[1321574400000,53.56],[1321833600000,52.72],[1321920000000,53.79],[1322006400000,52.43],[1322179200000,51.94],[1322438400000,53.73],[1322524800000,53.31],[1322611200000,54.6],[1322697600000,55.42],[1322784000000,55.67],[1323043200000,56.14],[1323129600000,55.85],[1323216000000,55.58],[1323302400000,55.81],[1323388800000,56.23],[1323648000000,55.98],[1323734400000,55.54],[1323820800000,54.31],[1323907200000,54.13],[1323993600000,54.43],[1324252800000,54.6],[1324339200000,56.56],[1324425600000,56.64],[1324512000000,56.94],[1324598400000,57.62],[1324944000000,58.08],[1325030400000,57.52],[1325116800000,57.87],[1325203200000,57.86],[1325548800000,58.75],[1325635200000,59.06],[1325721600000,59.72],[1325808000000,60.34],[1326067200000,60.25],[1326153600000,60.46],[1326240000000,60.36],[1326326400000,60.2],[1326412800000,59.97],[1326758400000,60.67],[1326844800000,61.3],[1326931200000,61.11],[1327017600000,60.04],[1327276800000,61.06],[1327363200000,60.06],[1327449600000,63.81],[1327536000000,63.52],[1327622400000,63.9],[1327881600000,64.72],[1327968000000,65.21],[1328054400000,65.17],[1328140800000,65.02],[1328227200000,65.67],[1328486400000,66.28],[1328572800000,66.98],[1328659200000,68.1],[1328745600000,70.45],[1328832000000,70.49],[1329091200000,71.8],[1329177600000,72.78],[1329264000000,71.1],[1329350400000,71.74],[1329436800000,71.73],[1329782400000,73.55],[1329868800000,73.29],[1329955200000,73.77],[1330041600000,74.63],[1330300800000,75.11],[1330387200000,76.49],[1330473600000,77.49],[1330560000000,77.78],[1330646400000,77.88],[1330905600000,76.17],[1330992000000,75.75],[1331078400000,75.81],[1331164800000,77.43],[1331251200000,77.88],[1331510400000,78.86],[1331596800000,81.16],[1331683200000,84.23],[1331769600000,83.65],[1331856000000,83.65],[1332115200000,85.87],[1332201600000,86.57],[1332288000000,86.07],[1332374400000,85.62],[1332460800000,85.15],[1332720000000,86.71],[1332806400000,87.78],[1332892800000,88.23],[1332979200000,87.12],[1333065600000,85.65],[1333324800000,88.38],[1333411200000,89.9],[1333497600000,89.19],[1333584000000,90.53],[1333929600000,90.89],[1334016000000,89.78],[1334102400000,89.46],[1334188800000,88.97],[1334275200000,86.46],[1334534400000,82.88],[1334620800000,87.1],[1334707200000,86.91],[1334793600000,83.92],[1334880000000,81.85],[1335139200000,81.67],[1335225600000,80.04],[1335312000000,87.14],[1335398400000,86.81],[1335484800000,86.14],[1335744000000,83.43],[1335830400000,83.16],[1335916800000,83.71],[1336003200000,83.12],[1336089600000,80.75],[1336348800000,81.35],[1336435200000,81.17],[1336521600000,81.31],[1336608000000,81.5],[1336694400000,80.96],[1336953600000,79.75],[1337040000000,79.02],[1337126400000,78.01],[1337212800000,75.73],[1337299200000,75.77],[1337558400000,80.18],[1337644800000,79.57],[1337731200000,81.51],[1337817600000,80.76],[1337904000000,80.33],[1338249600000,81.75],[1338336000000,82.74],[1338422400000,82.53],[1338508800000,80.14],[1338768000000,80.61],[1338854400000,80.4],[1338940800000,81.64],[1339027200000,81.67],[1339113600000,82.9],[1339372800000,81.6],[1339459200000,82.31],[1339545600000,81.74],[1339632000000,81.65],[1339718400000,82.02],[1339977600000,83.68],[1340064000000,83.92],[1340150400000,83.68],[1340236800000,82.52],[1340323200000,83.16],[1340582400000,81.54],[1340668800000,81.72],[1340755200000,82.07],[1340841600000,81.29],[1340928000000,83.43],[1341187200000,84.65],[1341273600000,85.63],[1341446400000,87.13],[1341532800000,86.55],[1341792000000,87.7],[1341878400000,86.89],[1341964800000,86.35],[1342051200000,85.56],[1342137600000,86.42],[1342396800000,86.7],[1342483200000,86.71],[1342569600000,86.61],[1342656000000,87.76],[1342742400000,86.33],[1343001600000,86.26],[1343088000000,85.85],[1343174400000,82.14],[1343260800000,82.13],[1343347200000,83.59],[1343606400000,85],[1343692800000,87.25],[1343779200000,86.69],[1343865600000,86.83],[1343952000000,87.96],[1344211200000,88.94],[1344297600000,88.7],[1344384000000,88.55],[1344470400000,88.68],[1344556800000,88.81],[1344816000000,90],[1344902400000,90.24],[1344988800000,90.12],[1345075200000,90.91],[1345161600000,92.59],[1345420800000,95.02],[1345507200000,93.72],[1345593600000,95.55],[1345680000000,94.66],[1345766400000,94.75],[1346025600000,96.53],[1346112000000,96.4],[1346198400000,96.21],[1346284800000,94.84],[1346371200000,95.03],[1346716800000,96.42],[1346803200000,95.75],[1346889600000,96.61],[1346976000000,97.21],[1347235200000,94.68],[1347321600000,94.37],[1347408000000,95.68],[1347494400000,97.57],[1347580800000,98.75],[1347840000000,99.97],[1347926400000,100.27],[1348012800000,100.3],[1348099200000,99.81],[1348185600000,100.01],[1348444800000,98.68],[1348531200000,96.22],[1348617600000,95.03],[1348704000000,97.33],[1348790400000,95.3],[1349049600000,94.2],[1349136000000,94.47],[1349222400000,95.92],[1349308800000,95.26],[1349395200000,93.23],[1349654400000,91.17],[1349740800000,90.84],[1349827200000,91.56],[1349913600000,89.7],[1350000000000,89.96],[1350259200000,90.68],[1350345600000,92.83],[1350432000000,92.09],[1350518400000,90.38],[1350604800000,87.12],[1350864000000,90.58],[1350950400000,87.62],[1351036800000,88.12],[1351123200000,87.08],[1351209600000,86.29],[1351641600000,85.05],[1351728000000,85.22],[1351814400000,82.4],[1352073600000,83.52],[1352160000000,83.26],[1352246400000,79.71],[1352332800000,76.82],[1352419200000,78.15],[1352678400000,77.55],[1352764800000,77.56],[1352851200000,76.7],[1352937600000,75.09],[1353024000000,75.38],[1353283200000,80.82],[1353369600000,80.13],[1353456000000,80.24],[1353628800000,81.64],[1353888000000,84.22],[1353974400000,83.54],[1354060800000,83.28],[1354147200000,84.19],[1354233600000,83.61],[1354492800000,83.74],[1354579200000,82.26],[1354665600000,76.97],[1354752000000,78.18],[1354838400000,76.18],[1355097600000,75.69],[1355184000000,77.34],[1355270400000,77],[1355356800000,75.67],[1355443200000,72.83],[1355702400000,74.12],[1355788800000,76.27],[1355875200000,75.19],[1355961600000,74.53],[1356048000000,74.19],[1356307200000,74.31],[1356480000000,73.29],[1356566400000,73.58],[1356652800000,72.8],[1356912000000,76.02],[1357084800000,78.43],[1357171200000,77.44],[1357257600000,75.29],[1357516800000,74.8],[1357603200000,75.04],[1357689600000,73.87],[1357776000000,74.79],[1357862400000,74.33],[1358121600000,71.68],[1358208000000,69.42],[1358294400000,72.3],[1358380800000,71.81],[1358467200000,71.43],[1358812800000,72.11],[1358899200000,73.43],[1358985600000,64.36],[1359072000000,62.84],[1359331200000,64.26],[1359417600000,65.47],[1359504000000,65.26],[1359590400000,65.07],[1359676800000,64.8],[1359936000000,63.19],[1360022400000,65.41],[1360108800000,65.34],[1360195200000,66.89],[1360281600000,67.85],[1360540800000,68.56],[1360627200000,66.84],[1360713600000,66.72],[1360800000000,66.66],[1360886400000,65.74],[1361232000000,65.71],[1361318400000,64.12],[1361404800000,63.72],[1361491200000,64.4],[1361750400000,63.26],[1361836800000,64.14],[1361923200000,63.51],[1362009600000,63.06],[1362096000000,61.5],[1362355200000,60.01],[1362441600000,61.59],[1362528000000,60.81],[1362614400000,61.51],[1362700800000,61.67],[1362960000000,62.55],[1363046400000,61.2],[1363132800000,61.19],[1363219200000,61.79],[1363305600000,63.38],[1363564800000,65.1],[1363651200000,64.93],[1363737600000,64.58],[1363824000000,64.68],[1363910400000,65.99],[1364169600000,66.23],[1364256000000,65.88],[1364342400000,64.58],[1364428800000,63.24],[1364774400000,61.27],[1364860800000,61.4],[1364947200000,61.71],[1365033600000,61.1],[1365120000000,60.46],[1365379200000,60.89],[1365465600000,61],[1365552000000,62.24],[1365638400000,62.05],[1365724800000,61.4],[1365984000000,59.98],[1366070400000,60.89],[1366156800000,57.54],[1366243200000,56.01],[1366329600000,55.79],[1366588800000,56.95],[1366675200000,58.02],[1366761600000,57.92],[1366848000000,58.34],[1366934400000,59.6],[1367193600000,61.45],[1367280000000,63.25],[1367366400000,62.76],[1367452800000,63.65],[1367539200000,64.28],[1367798400000,65.82],[1367884800000,65.52],[1367971200000,66.26],[1368057600000,65.25],[1368144000000,64.71],[1368403200000,64.96],[1368489600000,63.41],[1368576000000,61.26],[1368662400000,62.08],[1368748800000,61.89],[1369008000000,63.28],[1369094400000,62.81],[1369180800000,63.05],[1369267200000,63.16],[1369353600000,63.59],[1369699200000,63.06],[1369785600000,63.56],[1369872000000,64.51],[1369958400000,64.25],[1370217600000,64.39],[1370304000000,64.19],[1370390400000,63.59],[1370476800000,62.64],[1370563200000,63.12],[1370822400000,62.7],[1370908800000,62.51],[1370995200000,61.74],[1371081600000,62.28],[1371168000000,61.44],[1371427200000,61.71],[1371513600000,61.68],[1371600000000,60.43],[1371686400000,59.55],[1371772800000,59.07],[1372032000000,57.51],[1372118400000,57.52],[1372204800000,56.87],[1372291200000,56.25],[1372377600000,56.65],[1372636800000,58.46],[1372723200000,59.78],[1372809600000,60.11],[1372982400000,59.63],[1373241600000,59.29],[1373328000000,60.34],[1373414400000,60.1],[1373500800000,61.04],[1373587200000,60.93],[1373846400000,61.06],[1373932800000,61.46],[1374019200000,61.47],[1374105600000,61.68],[1374192000000,60.71],[1374451200000,60.9],[1374537600000,59.86],[1374624000000,62.93],[1374710400000,62.64],[1374796800000,63],[1375056000000,63.97],[1375142400000,64.76],[1375228800000,64.65],[1375315200000,65.24],[1375401600000,66.08],[1375660800000,67.06],[1375747200000,66.46],[1375833600000,66.43],[1375920000000,65.86],[1376006400000,64.92],[1376265600000,66.77],[1376352000000,69.94],[1376438400000,71.21],[1376524800000,71.13],[1376611200000,71.76],[1376870400000,72.53],[1376956800000,71.58],[1377043200000,71.77],[1377129600000,71.85],[1377216000000,71.57],[1377475200000,71.85],[1377561600000,69.8],[1377648000000,70.13],[1377734400000,70.24],[1377820800000,69.6],[1378166400000,69.8],[1378252800000,71.24],[1378339200000,70.75],[1378425600000,71.17],[1378684800000,72.31],[1378771200000,70.66],[1378857600000,66.82],[1378944000000,67.53],[1379030400000,66.41],[1379289600000,64.3],[1379376000000,65.05],[1379462400000,66.38],[1379548800000,67.47],[1379635200000,66.77],[1379894400000,70.09],[1379980800000,69.87],[1380067200000,68.79],[1380153600000,69.46],[1380240000000,68.96],[1380499200000,68.11],[1380585600000,69.71],[1380672000000,69.94],[1380758400000,69.06],[1380844800000,69],[1381104000000,69.68],[1381190400000,68.71],[1381276800000,69.51],[1381363200000,69.95],[1381449600000,70.4],[1381708800000,70.86],[1381795200000,71.24],[1381881600000,71.59],[1381968000000,72.07],[1382054400000,72.7],[1382313600000,74.48],[1382400000000,74.27],[1382486400000,74.99],[1382572800000,75.99],[1382659200000,75.14],[1382918400000,75.7],[1383004800000,73.81],[1383091200000,74.98],[1383177600000,74.67],[1383264000000,74.29],[1383523200000,75.25],[1383609600000,75.06],[1383696000000,74.42],[1383782400000,73.21],[1383868800000,74.37],[1384128000000,74.15],[1384214400000,74.29],[1384300800000,74.38],[1384387200000,75.45],[1384473600000,75],[1384732800000,74.09],[1384819200000,74.22],[1384905600000,73.57],[1384992000000,74.45],[1385078400000,74.26],[1385337600000,74.82],[1385424000000,76.2],[1385510400000,77.99],[1385683200000,79.44],[1385942400000,78.75],[1386028800000,80.9],[1386115200000,80.71],[1386201600000,81.13],[1386288000000,80],[1386547200000,80.92],[1386633600000,80.79],[1386720000000,80.19],[1386806400000,80.08],[1386892800000,79.2],[1387152000000,79.64],[1387238400000,79.28],[1387324800000,78.68],[1387411200000,77.78],[1387497600000,78.43],[1387756800000,81.44],[1387843200000,81.1],[1388016000000,80.56],[1388102400000,80.01],[1388361600000,79.22],[1388448000000,80.15],[1388620800000,79.02],[1388707200000,77.28],[1388966400000,77.7],[1389052800000,77.15],[1389139200000,77.64],[1389225600000,76.65],[1389312000000,76.13],[1389571200000,76.53],[1389657600000,78.06],[1389744000000,79.62],[1389830400000,79.18],[1389916800000,77.24],[1390262400000,78.44],[1390348800000,78.79],[1390435200000,79.45],[1390521600000,78.01],[1390780800000,78.64],[1390867200000,72.36],[1390953600000,71.54],[1391040000000,71.4],[1391126400000,71.51],[1391385600000,71.65],[1391472000000,72.68],[1391558400000,73.23],[1391644800000,73.22],[1391731200000,74.24],[1391990400000,75.57],[1392076800000,76.57],[1392163200000,76.56],[1392249600000,77.78],[1392336000000,77.71],[1392681600000,78],[1392768000000,76.77],[1392854400000,75.88],[1392940800000,75.04],[1393200000000,75.36],[1393286400000,74.58],[1393372800000,73.91],[1393459200000,75.38],[1393545600000,75.18],[1393804800000,75.39],[1393891200000,75.89],[1393977600000,76.05],[1394064000000,75.82],[1394150400000,75.78],[1394409600000,75.85],[1394496000000,76.58],[1394582400000,76.66],[1394668800000,75.81],[1394755200000,74.96],[1395014400000,75.25],[1395100800000,75.91],[1395187200000,75.89],[1395273600000,75.53],[1395360000000,76.12],[1395619200000,77.03],[1395705600000,77.86],[1395792000000,77.11],[1395878400000,76.78],[1395964800000,76.69],[1396224000000,76.68],[1396310400000,77.38],[1396396800000,77.51],[1396483200000,76.97],[1396569600000,75.97],[1396828800000,74.78],[1396915200000,74.78],[1397001600000,75.76],[1397088000000,74.78],[1397174400000,74.23],[1397433600000,74.53],[1397520000000,73.99],[1397606400000,74.14],[1397692800000,74.99],[1398038400000,75.88],[1398124800000,75.96],[1398211200000,74.96],[1398297600000,81.11],[1398384000000,81.71],[1398643200000,84.87],[1398729600000,84.62],[1398816000000,84.3],[1398902400000,84.5],[1398988800000,84.65],[1399248000000,85.85],[1399334400000,84.92],[1399420800000,84.62],[1399507200000,84],[1399593600000,83.65],[1399852800000,84.69],[1399939200000,84.82],[1400025600000,84.84],[1400112000000,84.12],[1400198400000,85.36],[1400457600000,86.37],[1400544000000,86.39],[1400630400000,86.62],[1400716800000,86.75],[1400803200000,87.73],[1401148800000,89.38],[1401235200000,89.14],[1401321600000,90.77],[1401408000000,90.43],[1401667200000,89.81],[1401753600000,91.08],[1401840000000,92.12],[1401926400000,92.48],[1402012800000,92.22],[1402272000000,93.7],[1402358400000,94.25],[1402444800000,93.86],[1402531200000,92.29],[1402617600000,91.28],[1402876800000,92.2],[1402963200000,92.08],[1403049600000,92.18],[1403136000000,91.86],[1403222400000,90.91],[1403481600000,90.83],[1403568000000,90.28],[1403654400000,90.36],[1403740800000,90.9],[1403827200000,91.98],[1404086400000,92.93],[1404172800000,93.52],[1404259200000,93.48],[1404345600000,94.03],[1404691200000,95.97],[1404777600000,95.35],[1404864000000,95.39],[1404950400000,95.04],[1405036800000,95.22],[1405296000000,96.45],[1405382400000,95.32],[1405468800000,94.78],[1405555200000,93.09],[1405641600000,94.43],[1405900800000,93.94],[1405987200000,94.72],[1406073600000,97.19],[1406160000000,97.03],[1406246400000,97.67],[1406505600000,99.02],[1406592000000,98.38],[1406678400000,98.15],[1406764800000,95.6],[1406851200000,96.13],[1407110400000,95.59],[1407196800000,95.12],[1407283200000,94.96],[1407369600000,94.48],[1407456000000,94.74],[1407715200000,95.99],[1407801600000,95.97],[1407888000000,97.24],[1407974400000,97.5],[1408060800000,97.98],[1408320000000,99.16],[1408406400000,100.53],[1408492800000,100.57],[1408579200000,100.58],[1408665600000,101.32],[1408924800000,101.54],[1409011200000,100.89],[1409097600000,102.13],[1409184000000,102.25],[1409270400000,102.5],[1409616000000,103.3],[1409702400000,98.94],[1409788800000,98.12],[1409875200000,98.97],[1410134400000,98.36],[1410220800000,97.99],[1410307200000,101],[1410393600000,101.43],[1410480000000,101.66],[1410739200000,101.63],[1410825600000,100.86],[1410912000000,101.58],[1410998400000,101.79],[1411084800000,100.96],[1411344000000,101.06],[1411430400000,102.64],[1411516800000,101.75],[1411603200000,97.87],[1411689600000,100.75],[1411948800000,100.11],[1412035200000,100.75],[1412121600000,99.18],[1412208000000,99.9],[1412294400000,99.62],[1412553600000,99.62],[1412640000000,98.75],[1412726400000,100.8],[1412812800000,101.02],[1412899200000,100.73],[1413158400000,99.81],[1413244800000,98.75],[1413331200000,97.54],[1413417600000,96.26],[1413504000000,97.67],[1413763200000,99.76],[1413849600000,102.47],[1413936000000,102.99],[1414022400000,104.83],[1414108800000,105.22],[1414368000000,105.11],[1414454400000,106.74],[1414540800000,107.34],[1414627200000,106.98],[1414713600000,108],[1414972800000,109.4],[1415059200000,108.6],[1415145600000,108.86],[1415232000000,108.7],[1415318400000,109.01],[1415577600000,108.83],[1415664000000,109.7],[1415750400000,111.25],[1415836800000,112.82],[1415923200000,114.18],[1416182400000,113.99],[1416268800000,115.47],[1416355200000,114.67],[1416441600000,116.31],[1416528000000,116.47],[1416787200000,118.62],[1416873600000,117.6],[1416960000000,119],[1417132800000,118.93],[1417392000000,115.07],[1417478400000,114.63],[1417564800000,115.93],[1417651200000,115.49],[1417737600000,115],[1417996800000,112.4],[1418083200000,114.12],[1418169600000,111.95],[1418256000000,111.62],[1418342400000,109.73],[1418601600000,108.22],[1418688000000,106.74],[1418774400000,109.41],[1418860800000,112.65],[1418947200000,111.78],[1419206400000,112.94],[1419292800000,112.54],[1419379200000,112.01],[1419552000000,113.99],[1419811200000,113.91],[1419897600000,112.52],[1419984000000,110.38],[1420156800000,109.33],[1420416000000,106.25],[1420502400000,106.26],[1420588800000,107.75],[1420675200000,111.89],[1420761600000,112.01],[1421020800000,109.25],[1421107200000,110.22],[1421193600000,109.8],[1421280000000,106.82],[1421366400000,105.99],[1421712000000,108.72],[1421798400000,109.55],[1421884800000,112.4],[1421971200000,112.98],[1422230400000,113.1],[1422316800000,109.14],[1422403200000,115.31],[1422489600000,118.9],[1422576000000,117.16],[1422835200000,118.63],[1422921600000,118.65],[1423008000000,119.56],[1423094400000,119.94],[1423180800000,118.93],[1423440000000,119.72],[1423526400000,122.02],[1423612800000,124.88],[1423699200000,126.46],[1423785600000,127.08],[1424131200000,127.83],[1424217600000,128.72],[1424304000000,128.45],[1424390400000,129.5],[1424649600000,133],[1424736000000,132.17],[1424822400000,128.79],[1424908800000,130.42],[1424995200000,128.46],[1425254400000,129.09],[1425340800000,129.36],[1425427200000,128.54],[1425513600000,126.41],[1425600000000,126.6],[1425859200000,127.14],[1425945600000,124.51],[1426032000000,122.24],[1426118400000,124.45],[1426204800000,123.59],[1426464000000,124.95],[1426550400000,127.04],[1426636800000,128.47],[1426723200000,127.5],[1426809600000,125.9],[1427068800000,127.21],[1427155200000,126.69],[1427241600000,123.38],[1427328000000,124.24],[1427414400000,123.25],[1427673600000,126.37],[1427760000000,124.43],[1427846400000,124.25],[1427932800000,125.32],[1428278400000,127.35],[1428364800000,126.01],[1428451200000,125.6],[1428537600000,126.56],[1428624000000,127.1],[1428883200000,126.85],[1428969600000,126.3],[1429056000000,126.78],[1429142400000,126.17],[1429228800000,124.75],[1429488000000,127.6],[1429574400000,126.91],[1429660800000,128.62],[1429747200000,129.67],[1429833600000,130.28],[1430092800000,132.65],[1430179200000,130.56],[1430265600000,128.64],[1430352000000,125.15],[1430438400000,128.95],[1430697600000,128.7],[1430784000000,125.8],[1430870400000,125.01],[1430956800000,125.26],[1431043200000,127.62],[1431302400000,126.32],[1431388800000,125.86],[1431475200000,126.01],[1431561600000,128.95],[1431648000000,128.77],[1431907200000,130.19],[1431993600000,130.07],[1432080000000,130.06],[1432166400000,131.39],[1432252800000,132.54],[1432598400000,129.62],[1432684800000,132.04],[1432771200000,131.78],[1432857600000,130.28],[1433116800000,130.54],[1433203200000,129.96],[1433289600000,130.12],[1433376000000,129.36],[1433462400000,128.65],[1433721600000,127.8],[1433808000000,127.42],[1433894400000,128.88],[1433980800000,128.59],[1434067200000,127.17],[1434326400000,126.92],[1434412800000,127.6],[1434499200000,127.3],[1434585600000,127.88],[1434672000000,126.6],[1434931200000,127.61],[1435017600000,127.03]];
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected: 1
                // selected : 3
            },

            title : {
                text : 'AAPL Stock Price'
            },

            series : [{
                name : 'AAPL',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });

        var chart = $('#container').highcharts(),
            xAxis = chart.xAxis[0];
        

        assert.equal(
            xAxis.max - xAxis.min,
            92 * 24 * 36e5 - 36e5,
            '3M'
        );

        // Click 6m
        chart.rangeSelector.clickButton(2);
        assert.equal(
            182 * 24 * 36e5 - 36e5, // half a year minus a DST crossover
            xAxis.max - xAxis.min,
            '6M'
        );


        // Run axis update
        $('#container').highcharts().xAxis[0].update();
        assert.equal(
            182 * 24 * 36e5 - 36e5, // half a year minus a DST crossover
            xAxis.max - xAxis.min,
            '6M after update'
        );

    });
});