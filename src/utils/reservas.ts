export function calcularNoches(checkIn: Date, checkOut: Date): number {
  if (checkOut <= checkIn) {
    throw new Error('La fecha de salida debe ser posterior a la de entrada');
  }
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function calcularTotal(
  noches: number,
  precioPorNoche: number,
  extras: number[] = [],
): number {
  const total = noches * precioPorNoche + extras.reduce((acc, e) => acc + e, 0);
  return Math.round(total * 100) / 100;
}

export function hayCapacidad(huespedes: number, capacidad: number): boolean {
  return huespedes > 0 && huespedes <= capacidad;
}