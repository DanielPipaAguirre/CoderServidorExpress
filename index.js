import express from "express";
import fs from "fs";

const app = express();
const port = 8080;

let contadorRuta1 = 0,
  contadorRuta2 = 0;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/items", async (req, res) => {
  contadorRuta1++;
  try {
    const productos = await fs.promises.readFile("./productos.txt");
    res.send(
      `<pre>${JSON.stringify(
        {
          items: JSON.parse(`${productos}`),
          cantidad: JSON.parse(`${productos}`).length,
        },
        null,
        2
      )}</pre>`
    );
  } catch {
    console.log("Hubo un error al traer los productos");
  }
});

app.get("/item-random", async (req, res) => {
  contadorRuta2++;
  try {
    const productos = await fs.promises.readFile("./productos.txt");
    const productObj = JSON.parse(`${productos}`);
    const id = Math.floor(Math.random() * (productObj.length - 0) + 0);
    res.send(
      `<pre>${JSON.stringify({
        item: productObj[id],
      })}</pre>`
    );
  } catch {
    console.log("Hubo un error al traer un producto random");
  }
});

app.get("/visitas", (req, res) => {
  try {
    res.send(
        `<pre>${JSON.stringify({
          visitas: {
            items: contadorRuta1,
            item: contadorRuta2,
          },
        })}</pre>`
      );
  } catch {
      console.log("Hubo un error al contar las rutas")
  }
});

app.listen(port, () => {
  console.log(`Puerto en consola: ${port}`);
});
