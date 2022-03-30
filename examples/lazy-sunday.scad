include <spiffsans.scad>;

$fn = 25;

module lazysunday()
{
	translate([-12.5,1,0])
	{
		text("LAZY",size=9,font="Spiff Sans");
	}
	translate([-21,-10.75,0])
	{
		text("SUNDAY",size=9,font="Spiff Sans");
	}
}

thickness = 3;
depth = 1;

scale([1.2,1,1]){
	difference(){
		linear_extrude(height=thickness,convexity=10)
		minkowski(){
		circle(r=2,$fn=25);
		polygon([[-12.5,11],[12.5,11],
				[12.5,-0.5],[20.5,-0.5],
				[20.5,-10.5],[-20.5,-10.5],
				[-20.5,-0.5],[-12.5,-0.5]]);
		}
		translate([0,0,thickness-depth])
		linear_extrude(height=depth+1,convexity=10)
		lazysunday();
	}
}

translate([0,0,thickness/2])
scale([1,1,thickness/2])
{
	translate([17,13,0])
	rotate_extrude(convexity = 10)
	translate([2, 0, 0])
	circle(r = 1, $fn = 25);

	translate([-17,13,0])
	rotate_extrude(convexity = 10)
	translate([2, 0, 0])
	circle(r = 1);
}