const API_BASE_URL = 'http://localhost:3000/fetch-data';

function getDistrictFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('district');
}

function loadDistrict(district) {
    fetch(`${API_BASE_URL}/${district}`)
        .then(response => response.json())
        .then(data => {
            displayInstitutionList(data, district);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('데이터를 가져오는 중 문제가 발생했습니다.');
        });
}

function displayInstitutionList(institutions, district) {
    const institutionList = document.getElementById('institution-list');
    institutionList.innerHTML = '';
    institutions.forEach(institution => {
        const name = getInstitutionName(institution, district);
        const listItem = document.createElement('a');
        listItem.href = `detail.html?district=${district}&name=${encodeURIComponent(name)}`;
        listItem.className = 'list-group-item list-group-item-action';
        listItem.textContent = name;
        institutionList.appendChild(listItem);
    });
}

function getInstitutionName(institution, district) {
    switch (district) {
        case '부평구':
            return institution.명칭;
        case '서구':
            return institution.의료기관명;
        case '동구':
            return institution.병원명;
        case '계양구':
            return institution.의료기관명;
        case '미추홀구':
            return institution.상호명;
        case '중구':
            return institution.기관명;
        default:
            return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const district = getDistrictFromUrl();
    document.getElementById('district-name').textContent = district;
    loadDistrict(district);
});
