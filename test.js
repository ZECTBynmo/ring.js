
if (typeof(exports) !== "undefined") { // nodejs
    _ = require("underscore");
}

test("base", function() {
    var C = ring.class({});
    deepEqual(C.__mro__, [C, ring.Object]);
});

test("mro", function() {
    var f = ring.class("f", [], {});
    deepEqual(f.__mro__, [f, ring.Object]);
    var e = ring.class("e", [], {});
    deepEqual(e.__mro__, [e, ring.Object]);
    var d = ring.class("d", [], {});
    deepEqual(d.__mro__, [d, ring.Object]);

    var c = ring.class("c", [d, f], {});
    deepEqual(c.__mro__, [c, d, f, ring.Object]);
    var b = ring.class("b", [d, e], {});
    deepEqual(b.__mro__, [b, d, e, ring.Object]);

    var a = ring.class("a", [b, c], {});
    deepEqual(a.__mro__, [a, b, c, d, e, f, ring.Object]);
});

test("inherit", function() {
    var A = ring.class({
        x: function() { return 1; },
    });
    var B = ring.class([A], {
        y: function() { return 2; },
    });
    equal(new A().x(), 1);
    equal(new B().x(), 1);
    equal(new B().y(), 2);
    var C = ring.class([A], {
        x: function() { return 3; },
    });
    equal(new C().x(), 3);
    var D = ring.class([A], {
        x: function() { return this.$super() + 5; },
    });
    equal(new D().x(), 6);
});

test("$init", function() {
    var A = ring.class({
        $init: function() {
            this.x = 3;
        },
    });
    equal(new A().x, 3);
});

test("instance", function() {
    var A = ring.class({});
    var B = ring.class([A], {});
    ok(ring.instance(new A(), A));
    ok(ring.instance(new B(), B));
    ok(ring.instance(new B(), A));
    ok(! ring.instance(new A(), B));

    ok(ring.instance([], Array));
    ok(! ring.instance([], A));
    ok(! ring.instance(new A(), Array));

    ok(ring.instance("", "string"));
    ok(ring.instance(function(){}, "function"));
    ok(ring.instance(2, "number"));
    ok(ring.instance({}, "object"));

});

test("$classInit", function() {
    var A = ring.class({
        $classInit: function(proto) {
            proto.x = 2;
        },
    });
    equal(new A().x, 2);
    var B = ring.class([A], {
        $classInit: function(proto) {
            proto.y = 3;
        },
    });
    equal(new B().x, 2);
    equal(new B().y, 3);
});

test("exceptions", function() {
    try {
        throw new ring.Error("test");
    } catch(e) {
        equal(e.message, "test");
        equal(e.name, "ring.Error");
        ok(e.stack.length > 0);
        ok(!!e.toString);
        ok(ring.instance(e, Error));
        ok(ring.instance(e, ring.Error));
    }

    try {
        throw new ring.ValueError("test");
    } catch(e) {
        equal(e.message, "test");
        equal(e.name, "ring.ValueError");
        ok(e.stack.length > 0);
        ok(!!e.toString);
        ok(ring.instance(e, Error));
        ok(ring.instance(e, ring.Error));
        ok(ring.instance(e, ring.ValueError));
    }
});