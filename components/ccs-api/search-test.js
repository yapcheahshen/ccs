var search=require("./search");
//Title positive id, Author Negative id
//Title Group returns TitleStart, TitleEnd, AuthorStart, AuthorEnd
QUnit.test("getTitleGroup",function() {
	var data=[1,-1,2,3,4,-2,-3,-4,5,6,-5,-6,7,-7];

	var res=search.getTitleGroup(data,0);
	deepEqual(res,[0,0,1,1]);

	var res=search.getTitleGroup(data,1);
	deepEqual(res,[0,0,1,1]);


	var res=search.getTitleGroup(data,2);
	deepEqual(res,[2,4,5,7]);

	var res=search.getTitleGroup(data,5);
	deepEqual(res,[2,4,5,7]);

	var res=search.getTitleGroup(data,6);
	deepEqual(res,[2,4,5,7]);

	var res=search.getTitleGroup(data,10);
	deepEqual(res,[8,9,10,11]);


});