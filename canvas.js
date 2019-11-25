class FactorioObject{ 
    constructor(img, grid_x, grid_y, ctx){
        this.type = 'belt'
        this.image = img;
        this.start_dir = 'south'
        this.end_dir = 'north'
        this.x = grid_x;
        this.y = grid_y;
        this.padding = 5
        this.ctx = ctx
    }
    rotate(grid){
        this.end_dir = rotation_map.get(this.end_dir)
        this.update(grid)
    }
    update(grid) {
        var up    = grid[this.x][this.y - 1]
        var right = grid[this.x + 1][this.y]
        var down  = grid[this.x][this.y + 1]
        var left  = grid[this.x - 1][this.y]
        
        if (up != null && up.end_dir == 'south' && this.end_dir != 'north'){
            this.start_dir = 'north'
        }
        else if (right != null && right.end_dir == 'west' && this.end_dir != 'east'){
            this.start_dir = 'east'
        }
        else if (down != null && down.end_dir == 'north' && this.end_dir != 'south'){
            this.start_dir = 'south'
        }
        else if (left != null && left.end_dir == 'east' && this.end_dir != 'west'){
            this.start_dir = 'west'
        }
        else {
            this.start_dir = flip_map.get(this.end_dir)
        }

        var image = new Image(tile_size, tile_size);
        image.src = get_image_path(this.type, this.start_dir, this.end_dir);
        this.image = image
        image.onload = this.draw.bind(this)

    }
    draw(){
        // Image, x_pos, y_pos, width, height
        this.ctx.clearRect(this.x * tile_size + this.padding, this.y * tile_size + this.padding, tile_size - this.padding * 2, tile_size - this.padding * 2)
        this.ctx.drawImage(this.image, this.x * tile_size, this.y * tile_size, tile_size, tile_size);
    }
}

class Splitter extends FactorioObject{
    constructor(img, grid_x, grid_y, ctx, side){
        super(img, grid_x, grid_y, ctx);
        this.type = 'splitter'
        this.splitter_pair = null;
        this.side = side
    }
}

class Grid{
    constructor(width, height){
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'main_canvas'
        this.canvas.width = width * tile_size
        this.canvas.height = height * tile_size
        // Makes the canvas focusable for keydown events
        this.canvas.tabIndex='1'
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        
        var x,y;
        // Draw the grid lines
        for(x = 0; x < this.canvas.width; x += tile_size){
            this.ctx.beginPath();
            this.ctx.moveTo(x,0);
            this.ctx.lineTo(x,this.canvas.height);
            this.ctx.stroke();
        }
        for(y = 0; y < this.canvas.height; y += tile_size){
            this.ctx.beginPath();
            this.ctx.moveTo(0,y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        this.canvas.addEventListener('click'  , this.canvas_on_click.bind(this)  , false);
        document.addEventListener('keydown', this.canvas_on_keydown.bind(this), false);

        // Starts as a width X height grid of null
        this.grid = []

        for(x = 0; x < width; x++){
            var column = []
            for(y = 0; y < height; y++){
                column.push(null)
            }
            this.grid.push(column)
        }


    }
    
    // Takes the page coordinates and returns which grid position that lies in
    get_tile_pos(pageX, pageY){
        var canvas_left = this.canvas.offsetLeft;
        var canvas_top = this.canvas.offsetTop;
        var x = pageX - canvas_left,
            y = pageY - canvas_top
        
        var grid_x = Math.floor(x / tile_size)
        var grid_y = Math.floor(y / tile_size)
        
        return {x : grid_x, y : grid_y}
    }

    canvas_on_click(event){
        var tile = this.get_tile_pos(event.pageX, event.pageY)

        var obj = null;
        if(selected_tile == 'belt'){
            obj = new FactorioObject(belt_img, tile.x, tile.y, this.ctx);
        }
        else if(selected_tile == 'splitter'){
            obj = new Splitter(splitter_img, tile.x, tile.y, this.ctx, 'left');
        }
        else if(selected_tile == 'underground'){
            obj = new FactorioObject(underground_img, tile.x, tile.y, this.ctx);
        }
        else{
            throw "Selected tile isn't belt, splitter, or underground :("
        }
        
        this.grid[tile.x][tile.y] = obj
        this.update_tile({x:tile.x, y:tile.y})
        obj.draw(tile_size);
    }
    
    // Takes a dictonary with xy coords on the grid and updates the cooresponding tile's image to match it's (start/end)_dir
    update_tile(tile_pos){
        var tile = this.grid[tile_pos.x][tile_pos.y]
        if(tile != null){
            tile.update(this.grid)
        }
    }

    // Takes in a dictionary with x y coords on the grid and rotates the cooresponding tile
    rotate_tile(tile_pos){
        var tile = this.grid[tile_pos.x][tile_pos.y]
        if(tile != null){
            tile.rotate(this.grid)
            // Update the tile we're pointing at
            var relative_position = number_map.get(tile.end_dir)
            var absolute_position = {x:tile.x + relative_position.x, y:tile.y + relative_position.y}
            this.update_tile(absolute_position)

        }
    }

    canvas_on_keydown(event){
        switch(event.keyCode){
            // r key
            case 82:
                var tile_pos = this.get_tile_pos(mousePosition.x, mousePosition.y)
                this.rotate_tile(tile_pos)
                break;
        }
    }
}

function get_image_path(type, start_dir, end_dir){
    valid_dirs = ['north', 'east', 'south', 'west']
    if (valid_dirs.indexOf(start_dir) == -1){
        throw "start_dir should be one of 'north', 'east', 'south', 'west'. Got " + start_dir
    }
    if (valid_dirs.indexOf(end_dir) == -1){
        throw "end_dir should be one of 'north', 'east', 'south', 'west'. Got " + end_dir
    }

    var base = 'images/' + type + '-' + start_dir + '-to-' + end_dir
    if (type == 'belt' || type == 'splitter'){
        return base + '.gif'
    }
    else if (type == 'underground'){
        return base + '.png'
    }
    else{
        throw "type argument to get_image_path function should be 'belt', 'splitter', or 'underground'. Got " + type
    }
}

tile_size = 60

rotation_map = new Map();
rotation_map.set('north', 'east')
rotation_map.set('east' , 'south')
rotation_map.set('south', 'west')
rotation_map.set('west' , 'north')

flip_map = new Map();
flip_map.set('north', 'south')
flip_map.set('south', 'north')
flip_map.set('east',  'west' )
flip_map.set('west',  'east' )

number_map = new Map();
number_map.set('north', {x:0, y:-1});
number_map.set('east' , {x:1, y:0 });
number_map.set('south', {x:0, y:1 });
number_map.set('west' , {x:-1,y:0 });

// Global var to keep track of mouse position
var mousePosition = {x:0, y:0};
document.addEventListener('mousemove',function(mouseMoveEvent){
mousePosition.x = mouseMoveEvent.pageX;
mousePosition.y = mouseMoveEvent.pageY;
});

// GET THE IMAGE.
var splitter_img = new Image(tile_size, tile_size);
splitter_img.src = 'images/splitter-south-to-north.gif';

var belt_img = new Image(tile_size, tile_size);
belt_img.src = 'images/belt-south-to-north.gif'

var underground_img = new Image(tile_size, tile_size);
underground_img.src = 'images/underground-south-to-north-end.png'

selected_tile = 'belt';

var grid = new Grid(10,10)


function add_selector_events(){
    var belt = document.getElementById('belt_select');
    var splitter = document.getElementById('splitter_select');
    var underground = document.getElementById('underground_select');

    belt.addEventListener('click', function(event){selected_tile = 'belt'} , false);
    splitter.addEventListener('click', function(event){selected_tile = 'splitter'} , false);
    underground.addEventListener('click', function(event){selected_tile = 'underground'} , false);
}


add_selector_events()
