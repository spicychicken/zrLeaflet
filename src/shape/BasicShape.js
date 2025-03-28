import * as L from "leaflet"

export function mixinShapeTemplate(BaseClass) {
    return class extends BaseClass {
        constructor(options) {
            super(options);
        }

        setColor(color) {
            if (this.type === 'line' || this.type == 'arcline') {
                this.style.stroke = color;
            }
            else {
                this.style.fill && (this.style.fill = color);
                this.style.stroke && (this.style.stroke = color);
            }
            return this;
        }

        setPosition(position) {
            this.attr('position', position);
            return this;
        }

        setSize(size) {
            this.attr("scale", size);
            return this;
        }

        setRotation(rotate) {
            this.attr("rotation", rotate * Math.PI / 180 || 0);
            return this;
        }

        setStroke(color) {
            return this.setStyle({"stroke": color});
        }

        setFill(color) {
            return this.setStyle({"fill": color});
        }

        setOpacity(opacity) {
            return this.setStyle({"opacity": opacity});
        }

        setBorderWidth(width) {
            return this.setStyle({"borderWidth": width});
        }

        setBorderColor(color) {
            return this.setStyle({"borderColor": color});
        }

        setAttr(attr) {
            this.attr(attr);
            return this;
        }

        moveAlong(target, time, loop=false, start=0, end=1) {
            this.percent = this.percent ? this.percent : start;
            var curPercent = this.percent;
            var shape = this;
            var animator = this.animate('', loop)
            .when(time, {
                percent: end
            })
            .during(function (_, percent) {
                shape.percent = percent;
                shape.setPosition(target.pointAt(percent));
            })
            .start(function (percent) {
                var newPercent = percent + curPercent;
                return newPercent > end ? newPercent - end + start : newPercent;
            });
            return animator;
        }
    };
}