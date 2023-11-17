import './main.css';

document.addEventListener("DOMContentLoaded", async () => {

  type CarInfo = {
    name: string;
    start: Date;
    end: Date;
  };

  let carData: CarInfo[] = [
  //  { id: uuid.v4(), name: 'H-CN101', start: new Date('2023-1-14'), end: new Date('2023-10-15') },
  //  { id: uuid.v4(), name: 'H-CN102', start: new Date('2023-3-14'), end: new Date('2023-9-15') },
    //{ id: uuid.v4(), name: 'H-CN103', start: new Date('2023-4-14'), end: new Date('2023-8-15') },
    //{ id: uuid.v4(), name: 'H-CN104', start: new Date('2023-2-14'), end: new Date('2023-12-15') },
    //{ id: uuid.v4(), name: 'H-CN105', start: new Date('2023-7-14'), end: new Date('2023-9-18') },
    //{ id: uuid.v4(), name: 'H-CN106', start: new Date('2023-5-14'), end: new Date('2023-10-17') },
  ];

  function createTableElement(elementType: string): HTMLElement {
    return document.createElement(elementType);
  }

  function applyStyles(element: HTMLElement, style: Record<string, string>) {
    for (const [key, value] of Object.entries(style)) {
      element.style[key] = value;
    }
  }

  function styleCells(cells: HTMLCollectionOf<HTMLElement>) {
    for (let cell of cells) {
      applyStyles(cell, {
        border: '1px solid #333',
        padding: '8px',
        textAlign: 'center',
      });
    }
  }

  function styleTable(table: HTMLTableElement) {
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '20px auto';
    table.style.border = '2px solid #333';
  }

  function createHeaderRow(data: CarInfo[], table: HTMLTableElement) {
    const headerRow = table.createTHead().insertRow(0);
    for (let j = 0; j < 13; j++) {
      const th = createTableElement('th');
      th.innerText = j === 0 ? (data.length > 0 ? 'Autos' : '') : j.toString();
      headerRow.appendChild(th);
    }
  }

  function createDataRow(car: CarInfo, tbody: HTMLTableSectionElement) {
    const row = tbody.insertRow();
    
    const startMonth = new Date(car.start).getMonth() + 1;
    const endMonth = new Date(car.end).getMonth() + 1;

    for (let j = 0; j < 13; j++) {
      const cell = row.insertCell(j);

      if (j === 0) {
        cell.innerText = car.name;
      } else if (j === startMonth || j === endMonth) {
        cell.style.backgroundColor = 'magenta';
      } else if (j > startMonth && j < endMonth) {
        cell.style.backgroundColor = '#03fccf';
      }
    }
  }

  function createHTMLTable(data: CarInfo[]) {
    const table = createTableElement('table') as HTMLTableElement;
    const tbody = table.createTBody();

    createHeaderRow(data, table);

    for (const car of data) {
      createDataRow(car, tbody);
    }

    styleTable(table);
    styleCells(table.getElementsByTagName('th'));
    styleCells(table.getElementsByTagName('td'));

    return table;
  }

  function createCalendar() {
    const table = createHTMLTable(carData);

    const existingTable = document.querySelector('table');
    if (existingTable) {
      existingTable.replaceWith(table);
    } else {
      document.body.appendChild(table);
    }
  }

  function createCarForm() {
    const form = createTableElement('form') as HTMLFormElement;

    const nameLabel = createTableElement('label');
    nameLabel.innerText = 'Car Name:';
    form.appendChild(nameLabel);

    const nameInput = createTableElement('input') as HTMLInputElement;
    nameInput.type = 'text';
    nameInput.name = 'name';
    form.appendChild(nameInput);

    const startDateLabel = createTableElement('label');
    startDateLabel.innerText = 'Start Month:';
    form.appendChild(startDateLabel);

    const startDateInput = createTableElement('input') as HTMLInputElement;
    startDateInput.type = 'month';  
    startDateInput.name = 'start_month';
    form.appendChild(startDateInput);

    const endDateLabel = createTableElement('label');
    endDateLabel.innerText = 'End Month:';
    form.appendChild(endDateLabel);

    const endDateInput = createTableElement('input') as HTMLInputElement;
    endDateInput.type = 'month';  
    endDateInput.name = 'end_month';
    form.appendChild(endDateInput);

    const submitButton = createTableElement('input') as HTMLButtonElement;
    submitButton.type = "button" 
    submitButton.value = 'Add Car';
    form.appendChild(submitButton);
    submitButton.addEventListener('click', async () => {
      const currentYear = new Date().getFullYear()
      
      const newCar: CarInfo = {
        name: nameInput.value,
        start: new Date(currentYear + `-${startDateInput.value}-01`),  
        end: new Date(currentYear + `-${endDateInput.value}-01`),      
      };
      console.log(newCar);
      
      await addCar(newCar);
      await fetchCars()
    });
    

    const existingForm = document.querySelector('form');
    if (existingForm) {
      existingForm.replaceWith(form);
    } else {
      document.body.appendChild(form); 
    }
  }


  async function addCar(car: CarInfo) {
    await fetch(`http://127.0.0.1:8000/add_car`,
      {
        method: 'POST', headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    })
      .then((response) => {
        console.log(response);
        
        return response.json()})
      .then((data) => {
        console.log('Car added:', data);
        carData.push(data);
        createCalendar();
      })
      .catch((error) => {
        console.error('Error adding car:', error);
      });
  }

  async function fetchCars() {
    await fetch('http://127.0.0.1:8000/get_cars', {
      cache: "no-cache"
    })
      .then((response) => {
        console.log(response);
        
        return response.json()})
      .then((data) => {
        console.log(data);
        
        carData.length = 0
        console.log(carData);
        
        carData.push(...data); 
        createCalendar();
      })
      .catch((error) => {
        console.error('Error fetching car data:', error);
      });
  }

  await fetchCars()

  createCarForm();
  createCalendar();
})