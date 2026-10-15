import { calcularNoches, calcularTotal, hayCapacidad } from './reservas';

describe('calcularNoches', () => {
  it('devuelve la cantidad de noches entre dos fechas', () => {
    // Arrange
    const entrada = new Date('2026-10-20');
    const salida = new Date('2026-10-23');
    // Act
    const resultado = calcularNoches(entrada, salida);
    // Assert
    expect(resultado).toBe(3);
  });

  it('lanza error si la salida es anterior a la entrada', () => {
    const entrada = new Date('2026-10-23');
    const salida = new Date('2026-10-20');
    expect(() => calcularNoches(entrada, salida)).toThrow();
  });
});

describe('calcularTotal', () => {
  it('multiplica noches por precio', () => {
    expect(calcularTotal(3, 100)).toBe(300);
  });

  it('suma los servicios extra', () => {
    expect(calcularTotal(2, 100, [15.5, 20])).toBe(235.5);
  });
});

describe('hayCapacidad', () => {
  it('acepta una cantidad de huéspedes dentro de la capacidad', () => {
    expect(hayCapacidad(2, 3)).toBe(true);
  });

  it('rechaza más huéspedes que la capacidad', () => {
    expect(hayCapacidad(5, 3)).toBe(false);
  });

  it('rechaza cero huéspedes', () => {
    expect(hayCapacidad(0, 3)).toBe(false);
  });
});