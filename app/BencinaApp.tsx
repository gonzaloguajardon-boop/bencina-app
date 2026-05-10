"use client";
import { useState } from "react";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const DISCOUNTS: Record<number, any[]> = {
  0: [
    { bencinera: "Shell",  tarjeta: "Banco BICE",      descuento: 100, tipo: "Crédito",   condicion: "App Shell · Tope $5.000/mes" },
    { bencinera: "Aramco", tarjeta: "Spin Visa",        descuento: 150, tipo: "Crédito",   condicion: "Tarjeta física o App Aramco · Tope $10.000/mes" },
  ],
  1: [
    { bencinera: "Aramco", tarjeta: "Banco Consorcio",  descuento: 150, tipo: "Crédito",   condicion: "App Aramco · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "Cencosud Scotiabank Black", descuento: 100, tipo: "Crédito", condicion: "App Copec · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "Jumbo Prime",      descuento: 100, tipo: "Fidelización", condicion: "Código desde Jumbo Prime · Tope 100L" },
    { bencinera: "Copec",  tarjeta: "Mercado Pago",     descuento: 100, tipo: "Prepago",   condicion: "App Copec · Máx. 1 carga de 40L/mes" },
  ],
  2: [
    { bencinera: "Shell",  tarjeta: "Lider BCI",        descuento: 100, tipo: "Crédito",   condicion: "App Shell · Tope $4.000, 2 cargas/mes" },
    { bencinera: "Copec",  tarjeta: "Banco Internacional", descuento: 100, tipo: "Crédito", condicion: "App Copec · Mastercard Clásica/Gold/Black" },
    { bencinera: "Copec",  tarjeta: "Itaú Legend",      descuento: 100, tipo: "Crédito",   condicion: "App Copec · Requiere cupón en sitio Itaú" },
    { bencinera: "Aramco", tarjeta: "Mercado Pago",     descuento: 50,  tipo: "Prepago",   condicion: "App Aramco · Tope $5.000/mes" },
  ],
  3: [
    { bencinera: "Aramco", tarjeta: "Ripley Gold",      descuento: 150, tipo: "Crédito",   condicion: "App Aramco o físico · Tope $8.000/mes" },
    { bencinera: "Aramco", tarjeta: "Ripley Silver",    descuento: 125, tipo: "Crédito",   condicion: "App Aramco o físico · Tope $8.000/mes" },
    { bencinera: "Copec",  tarjeta: "Scotiabank Visa",  descuento: 100, tipo: "Crédito",   condicion: "App Copec · Singular hasta $100/L" },
    { bencinera: "Copec",  tarjeta: "Automóvil Club",   descuento: 50,  tipo: "Club",      condicion: "App Copec · Socios Plan Movilidad · Tope $10.000" },
  ],
  4: [
    { bencinera: "Copec",  tarjeta: "Coopeuch Crédito", descuento: 200, tipo: "Crédito",   condicion: "
