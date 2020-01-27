export function init(canvas) {
	let ctx = canvas.getContext('2d');
	return ctx;
}

// TEMP SOLUTION WORKING ON EQUATION FOR APPLIED FORCE
export class RigidBody2D {
	constructor(gravity) { // add collider / friction / mass
		this.gravity = gravity;
		this.x_vel = 0;
		this.y_vel = 0;
	}
}

export class Entity {
	constructor(ctx, x, y) {
		this.ctx = ctx;
		this.x = x;
		this.y = y;
	}

	addRigidBody(rigidbody) {
		this.rigid = rigidbody;
	}

	rect(color, h, w) {
		this.color = color;
		this.h = h;
		this.w = w;
		this.ctx.fillStyle = color;
		this.ctx.fillRect(this.x, this.y, w, h);
	}

	circle(radius) {
		this.ctx.beginPath();
		this.ctx.arc(this.x,this.y,radius,0,2*Math.PI);
		this.ctx.fill();
	}

	forceRight(velocity) {
		this.rigid.x_vel += velocity;
	}

	forceLeft(velocity) {
		this.rigid.x_vel -= velocity;
	}

	update() {
		this.x += this.rigid.x_vel;
		this.rigid.x_vel *= 0.96; // change this to friction from rigidbody
		this.rect(this.color, this.h, this.w);
	}
}

// export class Rect extends Entity {
// 	constructor(color, h, w) {
// 		super()
// 	}
// }