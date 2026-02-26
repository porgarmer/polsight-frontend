export function booleanFormatter(status){
    return status ? "True" : "False"
}

export function positionRanFormatter(position){
    if (position === "mayor"){
        return "Mayor"
    }else if (position === "congressman"){
        return "Congressman"
    }
}

export function percentageFormatter(percentage){
    return percentage*100
}
