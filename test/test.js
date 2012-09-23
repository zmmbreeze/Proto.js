
/*jshint undef:true, browser:true, noarg:true, curly:true, regexp:true, newcap:true, trailing:false, noempty:true, regexp:false, strict:false, evil:true, funcscope:true, iterator:true, loopfunc:true, multistr:true, boss:true, eqnull:true, eqeqeq:false, undef:false*/

describe('Proto.js', function() {
    beforeEach(function() {
        jasmine.Clock.useMock();
    });

    it('Proto.js: normal test', function() {
        runs(function() {
            var Class = Proto.$extend(function() {
                    this.data = 'data';
                });
            Class.$methods({
                get: function(supr) {
                    supr(this);
                    // console.log(this, 'Father get():', this.a);
                    return this.a;
                },
                set: function(supr, a) {
                    supr(this, a);
                    this.a = a;
                    // console.log('Father set():', a);
                }
            });
            Class.$statics({
                get: function(supr) {
                    supr(this);
                    // console.log(this, 'Father get():', this.a);
                    return this.aa;
                },
                set: function(supr, a) {
                    supr(this, a);
                    this.aa = a;
                    // console.log('Father set():', a);
                }
            });
            var f = new Class();
            f.set(1);
            expect(f.get(1)).toEqual(1);
            expect(f.a).toEqual(1);
            expect(f.data).toEqual('data');
            expect(f.constructor === Class).toEqual(true);
            expect(f.$from(Class)).toEqual(true);
            Class.set(2);
            expect(Class.get()).toEqual(2);
            expect(Class.aa).toEqual(2);
        });
    });

    it('Proto.js: $methods() and $from', function() {
        runs(function() {
            var getCount = 0,
                setCount = 0;
            var Father = Proto.$extend();
            Father.$methods({
                get: function(supr) {
                    supr(this);
                    getCount++;
                    expect(getCount).toEqual(1);
                    // console.log(this, 'Father get():', this.a);
                    return this.a;
                },
                set: function(supr, a) {
                    supr(this, a);
                    setCount++;
                    expect(setCount).toEqual(1);
                    // console.log('Father set():', a);
                    this.a = a;
                }
            });
            var Son = Father.$extend(function(supr) {
                supr(this);
                this.isSon = true;
            });
            Son.$methods('get', function(supr) {
                supr(this);
                getCount++;
                expect(getCount).toEqual(2);
                // console.log(this, 'Son get():', this.a);
                return this.a;
            });
            Son.$methods('set', function(supr, a) {
                    supr(this, a);
                    setCount++;
                    expect(setCount).toEqual(2);
                    // console.log('Son set():', a);
                    this.a = a;
            });
            var GrandSon = Son.$extend(function(supr) {
                this.isGrandSon = true;
            });
            GrandSon.$methods({
                get: function(supr) {
                    supr(this);
                    getCount++;
                    expect(getCount).toEqual(3);
                    // console.log(this, 'GrandSon get():', this.a);
                    return this.a;
                },
                set: function(supr, a) {
                    supr(this, a);
                    setCount++;
                    expect(setCount).toEqual(3);
                    // console.log('GrandSon set():', a);
                    this.a = a;
                    return this;
                }
            });
            // test call order
            new GrandSon().get();
            getCount = 0;
            var GrandGrandSon = GrandSon.$extend();
            new GrandGrandSon().get();
            getCount = 0;

            // test this
            var gs1 = new GrandSon(),
                gs2 = new GrandSon();
            gs1.set(1);
            setCount = 0;
            gs2.set(2);
            setCount = 0;
            expect(gs1.get()).toEqual(1);
            getCount = 0;
            expect(gs2.get()).toEqual(2);
            getCount = 0;
            expect(gs1.a).toEqual(1);
            expect(gs2.a).toEqual(2);

            // test inherit: $from()
            var inherit = new GrandGrandSon();
            expect(inherit.$from(GrandGrandSon)).toEqual(true);
            expect(inherit.$from(GrandSon)).toEqual(true);
            expect(inherit.$from(Son)).toEqual(true);
            expect(inherit.$from(Father)).toEqual(true);
            expect(inherit.$from(Proto)).toEqual(true);
            expect(inherit.$from(function(){})).toEqual(false);

            // Another inherit
            var GGGSon = GrandGrandSon.$extend();
            GGGSon.$methods('set', function(supr,v) {
                this.aa = v;
                return supr(this,v);
            });
            var gggSon = new GGGSon();
            expect(gggSon.set('GGGSon')).toEqual(gggSon);
            expect(gggSon.aa).toEqual('GGGSon');
        });
    });


    it('Proto.js: $statics()', function() {
        runs(function() {
            var getCount = 0,
                setCount = 0;
            var Father = Proto.$extend();
            Father.$statics({
                get: function(supr) {
                    supr(this);
                    getCount++;
                    expect(getCount).toEqual(1);
                    // console.log(this, 'Father get():', this.a);
                    return this.a;
                },
                set: function(supr, a) {
                    supr(this, a);
                    setCount++;
                    expect(setCount).toEqual(1);
                    // console.log('Father set():', a);
                    this.a = a;
                }
            });
            var Son = Father.$extend();
            Son.$statics('get', function(supr) {
                supr(this);
                getCount++;
                expect(getCount).toEqual(2);
                // console.log(this, 'Son get():', this.a);
                return this.a;
            });
            Son.$statics('set', function(supr, a) {
                    supr(this, a);
                    setCount++;
                    expect(setCount).toEqual(2);
                    // console.log('Son set():', a);
                    this.a = a;
            });
            var GrandSon = Son.$extend();
            GrandSon.$statics({
                get: function(supr) {
                    supr(this);
                    getCount++;
                    expect(getCount).toEqual(3);
                    // console.log(this, 'GrandSon get():', this.a);
                    return this.a;
                },
                set: function(supr, a) {
                    supr(this, a);
                    setCount++;
                    expect(setCount).toEqual(3);
                    // console.log('GrandSon set():', a);
                    this.a = a;
                    return this;
                }
            });

            // test call order
            GrandSon.get();
            getCount = 0;
            var GrandGrandSon = GrandSon.$extend();
            GrandGrandSon.get();
            getCount = 0;

            // test this
            GrandSon.set(1);
            setCount = 0;
            GrandGrandSon.set(2);
            setCount = 0;
            expect(GrandSon.get()).toEqual(1);
            getCount = 0;
            expect(GrandGrandSon.get()).toEqual(2);
            getCount = 0;
            expect(GrandSon.a).toEqual(1);
            expect(GrandGrandSon.a).toEqual(2);


            // Another inherit
            var GGGSon = GrandGrandSon.$extend();
            GGGSon.$statics('set', function(supr,v) {
                this.aa = v;
                return supr(this,v);
            });
            expect(GGGSon.set('GGGSon')).toEqual(GGGSon);
            expect(GGGSon.aa).toEqual('GGGSon');
        });
    });

    it('Proto.js: $mixin()', function() {
        runs(function() {
            var ClassFather = Proto.$extend();
            ClassFather.$methods({
                set: function(supr, v) {this.vCF = v; return this;},
                get: function(supr) {return this.vCF;}
            });
            var getCount = 0,
                setCount = 0,
                Class = ClassFather.$extend(function(supr) {
                    supr(this);
                });
            var Father = Proto.$extend();
            Father.$methods({
                set: function(supr, v) {this.vF = v; return this;},
                get: function(supr) {return this.vF;}
            });
            var Mixined = Father.$extend();
            Mixined.$methods({
                get: function(supr) {
                    supr(this);
                    return this.v;
                },
                set: function(supr, v) {
                    supr(this, v);
                    this.v = v;
                    return this;
                }
            });
            Class.$mixin(Mixined);
            var a = new Class();
            expect(a.set(1)).toEqual(a);
            expect(a.get()).toEqual(1);
            expect(a.v).toEqual(1);
            expect(a.vF).toEqual(1);
            expect(a.vCF).toEqual(undefined);
            var Son = Class.$extend(function() {
                this.vSF = 1;
            });
            var b = new Son();
            expect(b.$from(Son)).toEqual(true);
            expect(b.$from(Class)).toEqual(true);
            expect(b.$from(ClassFather)).toEqual(true);
            expect(b.$from(Mixined)).toEqual(false);
            expect(b.set(1)).toEqual(b);
            expect(b.get()).toEqual(1);
            expect(b.v).toEqual(1);
            expect(b.vF).toEqual(1);
            expect(b.vCF).toEqual(undefined);
            expect(b.vSF).toEqual(1);
        });
    });
});

// report
var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 1000;
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter(htmlReporter);
jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
};
var currentWindowOnload = window.onload;
window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    execJasmine();
};
function execJasmine() {
    jasmineEnv.execute();
}
