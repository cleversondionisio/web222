window.addEventListener('DOMContentLoaded', function () {
  loadInfo().then((myInfo) => {
    document.querySelector('#name').innerText = myInfo.name;
    document.querySelector('#position').innerText = myInfo.position;
    document.querySelector('#age').innerText = myInfo.age;
    document.querySelector('#email').innerText = myInfo.email;
    document.querySelector('#language').innerText = myInfo.language;
    document.querySelector('#class_section').innerText = myInfo.class_section;
    document.querySelector('#student_id').innerText = myInfo.student_id;
    document.querySelector('#instructor').innerText = myInfo.instructor;
  });

  document.querySelector('#download').onclick = function (e) {
    let link = document.querySelector('.a_download');
    link.click();
    e.stopPropagation();
  };

  document.querySelector('#btn_contact').onclick = function (e) {
    //let form = document.querySelector('#');
    location.href = '#contact_me';
  };

  let selection = document.querySelectorAll('[name="selection"]');
  selection.forEach(function (elem) {
    elem.addEventListener('click', function (e) {
      let hrate = document.querySelector('.hrate');
      if (e.target.id === 'hiring') {
        hrate.style.display = 'block';
      } else {
        hrate.style.display = 'none';
      }
    });
  });

  let submit = document.querySelector('#submit');
  submit.addEventListener('click', function (e) {
    let submitForm = new Promise((resolve, reject) => {
      let name = document.querySelector('#form_name').value;
      let email = document.querySelector('#email').value;
      let address = document.querySelector('#address').value;
      let city = document.querySelector('#city').value;
      let postal = document.querySelector('#postal').value;
      let selection = document.querySelector('input[name="selection"]:checked').id;
      let hourlyRate = document.querySelector('#hourly_rate').value;
      let message = document.querySelector('#message').value;
      let postalCode = postalFilter(postal);

      if (name == '') {
        reject('Name must not be empty!');
      } else if (email == '') {
        reject('Email must not be empty!');
      } else if (address == '') {
        reject('Address must not be empty!');
      } else if (city == '') {
        reject('City must not be empty!');
      } else if (
        typeof postalCode == 'undefined' ||
        postalCode.length > 6 ||
        postalCode == 'null'
      ) {
        reject('Enter a correct postal code');
      } else if (selection === 'hiring' && (hourlyRate == '' || isNaN(hourlyRate))) {
        reject('Enter a correct hourly rate!');
      } else if (message == '') {
        reject('Message must not be empty!');
      } else {
        resolve('Form Successfully Submitted.');
      }
    });

    let errorContainer = document.querySelector('#error');
    let successContainer = document.querySelector('#success');
    submitForm
      .then((message) => {
        submitPost()
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });

        document.querySelector('#success_message').innerHTML = `${message}`;
        errorContainer.style.display = 'none';
        successContainer.style.display = 'block';

        let allInput = document.querySelectorAll('.input');
        allInput.forEach(function (elem) {
          elem.value = '';
        });
      })
      .catch((err) => {
        document.querySelector('#error_message').innerHTML = `${err}`;
        errorContainer.style.display = 'block';
        successContainer.style.display = 'none';
      });

    location.href = '#contact_me';
    e.preventDefault();
  });
});

async function submitPost() {
  let name = document.querySelector('#form_name').value;
  let email = document.querySelector('#email').value;
  let address = document.querySelector('#address').value;
  let city = document.querySelector('#city').value;
  let postal = document.querySelector('#postal').value;
  let selection = document.querySelector('input[name="selection"]:checked').id;
  let hourlyRate = document.querySelector('#hourly_rate').value;
  let message = document.querySelector('#message').value;
  const res = await fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // your expected POST request payload goes here
      oName: name,
      oEmail: email,
      oAddress: address,
      oCity: city,
      oPostal: postal,
      oHourlyRate: hourlyRate,
      oMessage: message
    })
  });

  const data = await res.json();

  return data;
}

async function loadInfo() {
  const res = await fetch('myInfo.json');

  const data = await res.json();

  return data;
}

function postalFilter(postalCode) {
  if (!postalCode) {
    return null;
  }

  postalCode = postalCode.toString().trim();

  var ca = new RegExp(/([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i);

  if (ca.test(postalCode.toString().replace(/\W+/g, ''))) {
    return postalCode;
  }
  return null;
}
