window.onload = () => {
  
  // form page
  const buttonFormPage = document.querySelector('.form-page');
  buttonFormPage.addEventListener('click', () => formPage('active'));
  
  function formPage(className) {
    const formWrapper = document.querySelector('.form-wrapper');
    formWrapper.classList.add(className);
    
    if (formWrapper.classList.contains(className)) {
      const closeButton = formWrapper.querySelector('.close-button');
      closeButton.addEventListener('click', () => formWrapper.classList.remove(className));
    }
  }
  
  const inputLimit = document.querySelectorAll('.input-limit');
  
  function showLimitFromInput() {
    inputLimit.forEach(input => {
      const limit = input.dataset.limit;
      const text = input.nextElementSibling;
      text.textContent = `0 / ${limit}`;
    });
  }
  
  showLimitFromInput();
  
  function inputCharacterLimit() {
    inputLimit.forEach(input => {
      input.addEventListener('keyup', function() {
        const value = this.value.length;
        const limit = this.dataset.limit;
        const text = this.nextElementSibling;
        text.textContent = `${value} / ${limit}`;
        this.classList.toggle('active', value > limit);
        this.dataset.error = (value > limit) ? 'true' : 'false';
        
        console.log(this.dataset.error);
      })
    })
  }
  
  inputCharacterLimit();
  
  function form() {
    const inputName = document.querySelector('#name');
    const inputAuthor = document.querySelector('#author');
    const inputPages = document.querySelector('#pages');
    const inputStatus = document.querySelector('#status');
    
    const button = document.querySelector('#button-submit');
    button.addEventListener('click', () => {
      if (validate(inputName, inputAuthor, inputPages) == true) {
        // jika menghasilkan boolean true, jalankan function addData();
        addData(inputName, inputAuthor, inputPages, inputStatus);
        // bersihkan value dari semua input 
        inputName.value = '';
        inputAuthor.value = '';
        inputPages.value = '';
      }
    });
  }
  
  form();
  
  function sweetalert(icon, title, text, position = 'center') {
    swal.fire({
      icon: icon,
      title: title,
      text: text,
      position: position
    });
  }
  
  function validate(inputName, inputAuthor, inputPages) {
    if (!inputName.value && !inputAuthor.value && !inputPages.value) return sweetalert('error', 'Error!', 'isi semua input terlebih dahulu!');
    if (!inputName.value || !inputAuthor.value || !inputPages.value) return sweetalert('error', 'Error!', 'isi input yang kosong terlebih dahulu!');
    
    // validate input name 
    if (inputName.value.length < 3) return sweetalert('error', 'Error!', 'nama judul terlalu pendek!');
    if (inputName.dataset.error == 'true') return sweetalert('error', 'Error!', 'nama judul melebihi batas maximum!');
    if (inputName.value.match(/[0-9]/g)) return sweetalert('error', 'Error!', 'input name hanya boleh berisikan huruf saja!');
    
    // validate input author
    if (inputAuthor.value.length < 3) return sweetalert('error', 'Error!', 'nama author terlalu pendek!');
    if (inputAuthor.dataset.error == 'true') return sweetalert('error', 'Error!', 'nama author melebihi batas maximum');
    
    // validate input pages
    if (inputPages.value.match(/[a-zA-Z]/g)) return sweetalert('error', 'Error!', 'input pages hanya boleh berisikan angka saja!');
    if (inputPages.dataset.error == 'true') return sweetalert("error", 'Error!', 'jumlah halaman terlalu banyak atau panjang!'); 
    
    // hasilkan boolean true jika berhasil melewati validasi ini
    return true;
  }
  
  function createSimpleElement(elementName, valueElement, className) {
    const element = document.createElement(elementName);
    element.className = (!className) ? '' : className;
    const value = document.createTextNode(valueElement);
    element.appendChild(value);
    
    return element;
  }
  
  const tableBody = document.querySelector('.table-body');
  
  function addData(inputName, inputAuthor, inputPages, inputStatus) {
    const tr = document.createElement('tr');
    
    const tdName = createSimpleElement('td', inputName.value, 'td-name');
    const tdAuthor = createSimpleElement('td', inputAuthor.value, 'td-author');
    const tdPages = createSimpleElement('td', `${inputPages.value} pages`, 'td-pages');
    
    // td status
    const tdStatus = document.createElement('td');
    tdStatus.className = 'td-status';
    const badges = document.createElement('span');
    badges.className = `badges ${(inputStatus.value == 'read') ? 'badges-green' : 'badges-red'}`;
    const badgesValue = document.createTextNode(inputStatus.value);
    badges.appendChild(badgesValue);
    tdStatus.appendChild(badges);
    
    // td option
    const tdOption = document.createElement('td');
    tdOption.className = 'td-option';
    const span = document.createElement('span');
    span.className = 'icon';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash';
    icon.addEventListener('click', () => deleteData(tr));
    span.appendChild(icon);
    tdOption.appendChild(span);
    
    tr.appendChild(tdName);
    tr.appendChild(tdAuthor);
    tr.appendChild(tdPages);
    tr.appendChild(tdStatus);
    tr.appendChild(tdOption);
    
    if (tableBody.appendChild(tr)) {
      sweetalert('success', 'Success!', 'data baru berhasil ditambahkan!');
      searchData(tr, inputName, inputAuthor, inputPages, inputStatus);
      deleteAllData();
    }
  }
  
  function deleteData(tr) {
    swal.fire({
      icon: 'warning',
      title: 'yakin?',
      text: 'yakin ingin menghapus data tersebut?',
      showCancelButton: true,
      confirmButtonText: 'yes',
      cancelButtonText: 'no'
    }).then(result => {
      // jika tombol yang ditekan adalah yes, maka hapus data tersebut
      if (result.isConfirmed) {
        tr.remove();
        sweetalert('success', 'Success', 'data berhasil dihapus!');
      }
    });
  }
  
  function searchData(tr, ...parameters) {
    let string = '';
    parameters.forEach(param => string += param.value);
    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', function() {
      const value = this.value.toLowerCase();
      tr.style.display = (string.toLowerCase().indexOf(value) != -1) ? '' : 'none';
    });
  }
  
  function deleteAllData() {
    const button = document.querySelector('.delete-all');
    button.addEventListener('click', () => {
      swal.fire({
        icon: 'warning',
        title: 'yakin?',
        text: 'yakin ingin menghapus semua data tersebut?',
        showCancelButton: true,
        confirmButtonText: 'yes',
        cancelButtonText: 'no'
      }).then(result => {
        // jika tombol yang ditekan adalah yes, maka hapus data tersebut
        if (result.isConfirmed) {
          tableBody.innerHTML = '';
          sweetalert('success', 'Success', 'semua data berhasil dihapus!');
        }
      });
    });
  }
  
}