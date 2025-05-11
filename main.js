
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// create an engine
var engine = Engine.create();
ball_sizes = [1, 1.53, 2.04, 2.29, 2.87, 3.49, 3.52, 4.38, 4.87, 8.11, 8.11]
function new_ball(x,y, rank, isStatic=false, vx=0, vy=0) {
    var r =ball_sizes[rank] * ball_scale;
    if (y<0)
    {
        y = ceil;
    }
    if (isStatic)
    {
        mask = 0;
    }
    else
    {
        mask = -1;
    }

    var res = Bodies.circle(x, y, r, {
        // slop:0.0,
        isStatic: isStatic,
        collisionFilter:{mask: mask},
        friction: 0.03,
        restitution: 0.1,
        label: {rank: rank},
        render: {sprite: {
            texture: "./img/"+rank+".png",
            xScale: 2*r/500,
            yScale: 2*r/500}}}
        );
    Body.setVelocity(res, {x: vx, y:vy})
    return res;
};

function randomRank() {
    var n = maxRank + 1;
    var sum = n * (n+1) / 2;
    var r = Math.random()*sum;
    for (let i = 0; i < n; i++) {
        if (r<n-i){
            return i;
        } else {
            r -= n-i;
        }
    }
    return maxRank;
}

var dw = document.body.clientWidth;
var dh = document.body.clientHeight;

var h=Math.min(dh, dw*2);
var w=h/2;
var maxRank = 0;
var ball_scale = w/750*55/2;
var gravity_scale = 0.001*h/800;
var ceil = h*0.15;

var div = document.getElementById("div");
div.style.width=w;
div.style.height=h;

// create a renderer
var render = Render.create({
    element: div,
    engine: engine,
    options: {
        width: w,
        height: h,
        wireframes: false

    }
});
var next = new_ball(w/2, -1, 0, true);    // do not colliside.
var nextq = new_ball(w/2, -1, 1, true);    // do not colliside.
var ground = Bodies.rectangle(w/2, 0.95*h, w*1.1, h*0.1, { friction: 0.01, isStatic: true,
    render: {sprite: {
        texture: "img/ground.jpg",
        xScale: w/5590,
        yScale: h*0.1/935}}
});
var wall_left = Bodies.rectangle(-10, h/2, 20, h*1.1, {friction: 0.01, isStatic: true});
var wall_right = Bodies.rectangle(w+10, h/2, 20, h*1.1, {friction: 0.01, isStatic: true});

var gridBackground = Bodies.rectangle(w/2, .9*h/2, w, .9*h, {
    isStatic: true,
    isSensor: true,
    render: {
        sprite: {
            texture: "img/bg2.jpg",
            xScale: w/405,
            yScale: h*.9/720
        }
    }
});
for (let i = 0; i < 9; i++) {
    World.add(engine.world, new_ball(-w,-h,i, true));
    
}
World.add(engine.world, [ground, wall_left, wall_right, gridBackground, next]);

engine.world.gravity.scale = gravity_scale
var mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
Events.on(mouseConstraint, 'mousemove', function(event) {
    var x = event.mouse.position.x;
    if (event.mouse.button>-1)
    {    
        Body.setPosition(next, {x: x, y: next.position.y});
    }   
})
Events.on(mouseConstraint, 'mousedown', function(event) {
    var x = event.mouse.position.x;  
    Body.setPosition(next, {x: x, y: next.position.y});
})
Events.on(mouseConstraint, 'mouseup', function(event) {
        var x = event.mouse.position.x,
            // y = event.mouse.position.y,
            // console.log(next);
            // Body.set(next,{collisionFilter:{catagory:1, mask:0xffffffff, group:0}, isStatic: false});
            ball = new_ball(x, -1, next.label.rank, false, 0, h/80);
            console.log(ball);
        // Body.setStatic(next, false);
        World.add(engine.world, ball);

        World.remove(engine.world, next);
        next = new_ball(w/2, -1, randomRank(), true);
        World.add(engine.world, next);


    });

Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    // change object colours to show those starting a collision
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (pair.bodyA.label.rank==pair.bodyB.label.rank && pair.bodyA.label.rank < 8) {
            var x = (pair.bodyA.position.x + pair.bodyB.position.x)*0.5;
            var y = (pair.bodyA.position.y + pair.bodyB.position.y)*0.5;
            var vx = (pair.bodyA.velocity.x + pair.bodyB.velocity.x)*0.5;
            var vy = (pair.bodyA.velocity.y + pair.bodyB.velocity.y)*0.5;
            var ball =new_ball(x,y,pair.bodyA.label.rank+1, false, vx, vy);
            // Body.setVelocity(ball, v);
            World.remove(engine.world, [pair.bodyA, pair.bodyB]);
            pair.bodyA.label.rank=-1; // to avoid multiple match for the same ball.
            pair.bodyB.label.rank=-1;
            World.add(engine.world, ball);
            // console.log(ball);
            // console.log(ball.label.rank);

            maxRank = Math.min(4, Math.max(maxRank, ball.label.rank));
        }
    }

});


// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);