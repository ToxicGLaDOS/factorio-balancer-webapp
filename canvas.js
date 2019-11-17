class FactorioObject{ 
    constructor(img, grid_x, grid_y){
        this.image = img;
        this.x = grid_x;
        this.y = grid_y;
    }
    draw(tile_size){
        // Image, x_pos, y_pos, width, height
        ctx.drawImage(this.image, this.x * tile_size, this.y * tile_size, tile_size, tile_size);
    }
}

tile_size = 60

// GET THE IMAGE.
var splitter_img = new Image(tile_size, tile_size);
splitter_img.src = 'images/splitter-north.gif';

var belt_img = new Image(tile_size, tile_size);
belt_img.src = 'images/belt-south-to-north.gif'

var underground_img = new Image(tile_size, tile_size);
underground_img.src = 'images/underground-south-to-north-end.png'

selected_tile = 'belt';

var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');
canvas.width = tile_size * 10
canvas.height = tile_size * 10

var elements = []

function canvas_on_click(event){
    canvas_left = canvas.offsetLeft;
    canvas_top = canvas.offsetTop;
    var x = event.pageX - canvas_left,
        y = event.pageY - canvas_top
    
    grid_x = Math.floor(x / tile_size)
    grid_y = Math.floor(y / tile_size)


    var obj = null;
    if(selected_tile == 'belt'){
        obj = new FactorioObject(belt_img, grid_x, grid_y);
    }
    else if(selected_tile == 'splitter'){
        obj = new FactorioObject(splitter_img, grid_x, grid_y);
    }
    else if(selected_tile == 'underground'){
        obj = new FactorioObject(underground_img, grid_x, grid_y);
    }
    else{
        throw "Selected tile isn't belt, splitter, or underground :("
    }

    elements.push(obj);
    obj.draw(tile_size);
    /*
    elements.forEach(function(element, index, array) {
        element.draw(tile_size);
    });
    */
}

function create_grid() {
    for(x = 0; x < canvas.width; x += tile_size){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
        ctx.stroke();
    }
    for(y = 0; y < canvas.height; y += tile_size){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

    }
}

function add_selector_events(){
    var belt = document.getElementById('belt_select');
    var splitter = document.getElementById('splitter_select');
    var underground = document.getElementById('underground_select');

    belt.addEventListener('click', function(event){selected_tile = 'belt'} , false);
    splitter.addEventListener('click', function(event){selected_tile = 'splitter'} , false);
    underground.addEventListener('click', function(event){selected_tile = 'underground'} , false);
}


canvas.addEventListener('click', canvas_on_click, false);
create_grid()
add_selector_events()
