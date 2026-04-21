export interface Deltager {
    id: number;
    navn: string;
    points: number;
    win: number;
}

export interface Kamp {
    id: number;
    tidspunkt: string;
    vinder: string;
    vinderScore: number;
    taber: string;
    taberScore: number;
}