class Intersection {
    constructor(coordinate) {
        this._coordinate = coordinate;
        this._state = State.VACANT;
        this._stack = new Stack(null);
    }

    clone() {
        let intersection = new Intersection(this._coordinate.clone());

        intersection.set(this._state, this._stack);
        return intersection;
    }

    // implémentation des autres méthodes qui semblent nécessaires ...
}

export default Intersection