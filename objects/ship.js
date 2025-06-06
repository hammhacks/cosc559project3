const WEAPON_COOLDOWN_TIME = 80;
const WEAPON_TEMP_ADDEND = 50;
const WEAPON_MAX_SAFE_TEMP = 1000;
const WEAPON_TEMP_DECREASE_STEP = 1;

class Ship {
    
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.heading = 0;
    this.rotation = 0;
    this.isBoosting = false;
    this.maxHealth = 100;
    this.health = 100;
    this.size = 50;
    this.color = color(200);
    this.weaponTemp = 0;
    //time that the player cannot shoot before guns cooldown
    this.weaponTempCooldownTime = WEAPON_COOLDOWN_TIME;

  }

  update() {
    this.heading += this.rotation;
    if (this.isBoosting) this.boost();
    this.pos.add(this.vel);
    this.vel.mult(0.99);
    this.edges();
    this.weaponTempCooldown();
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);

        fill(this.color);
    //noStroke();
    
    //fill(200);
    stroke(255);
    strokeWeight(2);
    this.drawShipBody();
    this.drawWings();
    this.drawExhaust();
    pop();
  }

  drawShipBody() {
    beginShape();
    vertex(-12, 10);
    vertex(12, 10);
    vertex(18, -10);
    vertex(0, -20);
    vertex(-18, -10);
    endShape(CLOSE);
  }

  drawWings() {
    fill(150);
    this.drawLeftWing();
    this.drawRightWing();
  }

  drawLeftWing() {
    beginShape();
    vertex(-12, 10);
    vertex(-24, 0);
    vertex(-24, -10);
    vertex(-12, -10);
    endShape(CLOSE);
  }

  drawRightWing() {
    beginShape();
    vertex(12, 10);
    vertex(24, 0);
    vertex(24, -10);
    vertex(12, -10);
    endShape(CLOSE);
  }

  drawExhaust() {
    fill(255, 0, 0);
    triangle(0, 10, -3, 20, 3, 20);
  }

  setRotation(angle) {
    this.rotation = angle;
  }

  boosting(b) {
    this.isBoosting = b;
  }

  boost() {
    let force = p5.Vector.fromAngle(this.heading - HALF_PI);
    force.mult(0.1);
    this.vel.add(force);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  hits(target) {
       
    let shipRadius = this.size / 2;
    
    // Handle asteroid collision
    if (target.constructor.name === 'Asteroid') {
      let d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
      return d < target.r + shipRadius;
    }

    // Handle UFO collision
    if (target.constructor.name === 'UFO') {
      let ufoRadius = target.size / 2;
      let d = dist(this.pos.x, this.pos.y, target.x, target.y);
      return d < ufoRadius + shipRadius;
    }

    return false;  // No collision
  }    
  
  takeDamage(amount) {
    this.health -= amount;
    this.updateColor();
    console.log(`Ship health: ${this.health}`);
  }
  
  updateColor() {
    if (this.health !== undefined && this.maxHealth !== undefined)
    {      
      // Map the health to red and green values for the color transition.
      // Start at 139 (dark red), end at 255 (bright red).
      let red = map(this.health, 0, this.maxHealth, 139, 255);
      
      // Start at 0 (no green), end at 100 (slightly greenish)
      let green = map(this.health, 0, this.maxHealth, 0, 100);
      
      // Darker red color as health goes down.
      // Red and Green channels, blue is 0.
      this.color = color(red, green, 0);
    }
  }
  
  increaseWeaponTemp() {

    this.weaponCooldownTime = WEAPON_COOLDOWN_TIME;
    this.weaponTemp = this.weaponTemp + WEAPON_TEMP_ADDEND;
    if(this.weaponTemp > WEAPON_MAX_SAFE_TEMP) {

      let lifeSubtrahend = Math.ceil((this.weaponTemp / WEAPON_MAX_SAFE_TEMP) * 2);
      this.health = this.health - lifeSubtrahend;
      
    }
    
  }
  
  weaponTempCooldown() {

    if(this.weaponCooldownTime == 0 && this.weaponTemp > 0) {
  
      this.weaponTemp = this.weaponTemp - WEAPON_TEMP_DECREASE_STEP;
      
    } else this.weaponCooldownTime = this.weaponCooldownTime - 1;
    
  }
  
}
/*

Weapon temperature mechanic:
When the player shoots, the weapon's temperature increases. If the player shoots after their weapon temp has reached 1000, they will lose more and more life the hotter their gun is.

The player has to go a certain time before their weapon temp drops. The 

*/