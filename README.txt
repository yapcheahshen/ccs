A. first time to run ccs
00._cd \dev2014
01._git clone https://github.com/yapcheahshen/ccs
02._cd ccs
06._node gen
0F._gulp
10._start http://127.0.0.1:2556/

B. next time to modify, rebuild, and run ccs
00._modify *.jsx
01._goto chrome://appcache-internals/
02._find Manifest: http://127.0.0.1:2556/offline.appcache
03._click Remove (to clear cache)
04._cd \dev2014\ccs
05._gulp
06._start http://127.0.0.1:2556/

C. next time to run ccs
00._start http://127.0.0.1:2556/

D. log history
00._cd \dev2014
01._git clone https://github.com/yapcheahshen/ccs
02._cd ccs
03. gulp
	failed to lookup "ccs"'s dependency "ccs-dataset"
04. node gen
	Cannot find module 'glob'
05. npm install glob
06._node gen
	no such file or directory 'C:\dev2014\ccs\components\ccs-dataset\collections.js'
07. git pull
08. node gen
09. gulp
	Error: ENOENT, open 'C:\dev2014\ccs\components\ccs-dataset\index.css'
0A. git pull
0B. gulp
	Cannot find module './node_scripts/newmodule'
0C. cd \dev2014
0D. git pull
0E. cd css
0F._gulp
10._start http://127.0.0.1:2556/