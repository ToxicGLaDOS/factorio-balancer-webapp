class FactorioObject{ 
    constructor(img, grid_x, grid_y){
        this.image = img;
        this.x = grid_x;
        this.y = grid_y;
    }
    draw(tile_size, ctx){
        // Image, x_pos, y_pos, width, height
        ctx.drawImage(this.image, this.x * tile_size, this.y * tile_size, tile_size, tile_size);
    }
}

class Grid{
    constructor(width, height){
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'main_canvas'
        this.canvas.width = width * tile_size
        this.canvas.height = height * tile_size
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

        this.canvas.addEventListener('click', this.canvas_on_click.bind(this), false);
        
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
    
    canvas_on_click(event){
        var canvas_left = this.canvas.offsetLeft;
        var canvas_top = this.canvas.offsetTop;
        var x = event.pageX - canvas_left,
            y = event.pageY - canvas_top
        
        var grid_x = Math.floor(x / tile_size)
        var grid_y = Math.floor(y / tile_size)


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
        
        this.grid[grid_x][grid_y] = obj
        obj.draw(tile_size, this.ctx);
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
