var canvas = document.getElementById('rotation');
var context = canvas.getContext('2d');

var flag = 0;
var flag_bez = 0;
var points = [];

function Bez(x0, y0, x1, y1, x2, y2){
	if(d(x0, y0, x1, y1, x2, y2) > parseInt("1px", 10)){
		var x3= 0.5*x0 + 0.5*x1;
		var y3= 0.5*y0 + 0.5*y1;
		
		var x4= 0.5*x1 + 0.5*x2;
		var y4= 0.5*y1 + 0.5*y2;
		
		var x5= 0.5*x3 + 0.5*x4;
		var y5= 0.5*y3 + 0.5*y4;
		
		Bez(x0, y0, x3, y3, x5, y5);
		Bez(x5, y5, x4, y4, x2, y2);
	} else{
		drawLine(x0, y0, x2, y2);
		//points.push({x: x0, y: y0});
		//points.push({x: x2, y: y2});
		return;
	}
}

function d(x0, y0, x1, y1, x2, y2){
	return Math.abs((y2-y0)*x1 - (x2 - x0) * y1 + (x2*y0 - x0*y2)) / (Math.sqrt((y2-y0)*(y2-y0) + (x2 - x0)*(x2 - x0)))
}

function Mult_Mv(M, v, dim){
            var res = [];
            for (var i=0; i<dim;i++) {
                res.push(0);
                for (var j=0; j<dim; j++) {
                    res[i] = res[i] + M[i*dim+j]*v[j];
                    
                }
            }
            return res;
}

canvas.addEventListener("click", function(event){
	if(!flag_bez){
		if(!flag){
			x0 = event.offsetX;
			y0 = event.offsetY;
			context.fillRect(x0, y0,2,2);
			flag = 1;
		} else{	
			x1 = event.offsetX;
			y1 = event.offsetY;
			context.fillRect(x1, y1,2,2);
			flag = 0;
			flag_bez = 1;
		}
	}else{
		x2 = event.offsetX;
		y2 = event.offsetY;
		context.fillRect(x2,y2,2,2);
		Bez(x0, y0, x1, y1, x2, y2);
		var out = [];
		for(var i = 0; i < 360; i += 10){
			x3 = x0 - x1;
			y3 = y0 - y1;
			x4 = x2 - x1;
			y4 = y2 - y1;
			var alpha = i*Math.PI/180;
			var M = [   Math.cos(alpha),    0, -1*Math.sin(alpha),    0,
                    0,                  1,  0,                  0,
                    Math.sin(alpha),    0, Math.cos(alpha), 0,
                    0,                  0,  0,                  1];
			out = Mult_Mv(M, [x3, y3, 0, 1], 4);
			x3 = out[0] + x1;
			y3 = out[1] + y1;
			out = Mult_Mv(M, [x4, y4, 0, 1], 4);
			x4 = out[0] + x1;
			y4 = out[1] + y1;
			Bez(x3, y3, x1, y1, x4, y4);
		}
	}
                });

function drawLine(Xd, Yd, Xf, Yf){
			var Dx,Dy,Dx2,Dy2,Dxy,S;
			var Xinc,Yinc,X,Y;
			var col, i;
			col = 5;
			if (Xd < Xf) Xinc = 1; else Xinc = -1;
			if (Yd < Yf) Yinc = 1; else Yinc = -1;
			Dx = Math.abs(Xd - Xf);
			Dy = Math.abs(Yd - Yf);
			Dx2 = Dx + Dx; Dy2 = Dy + Dy;
			X = Xd; Y = Yd;
				if (Dx > Dy){
				S = Dy2 - Dx;
				Dxy = Dy2 - Dx2;
				for (i=0; i < Dx; i++){
					if (S >= 0){
						Y = Y + Yinc;
						S = S + Dxy;
 					} else S = S + Dy2;
					X = X + Xinc;
					context.fillRect(X,Y,1,1);
				}
			}
            else{
                S = Dx2 - Dy;
                Dxy = Dx2 - Dy2;
                for (i=0; i < Dy; i++){
                    if ( S >= 0){
                        X = X + Xinc;
                        S = S + Dxy;
                    } else S = S + Dx2;
                    Y = Y + Yinc;
                    context.fillRect(X,Y,1,1);
                }
            }
        }