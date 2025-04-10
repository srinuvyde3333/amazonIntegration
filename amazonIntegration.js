import { LightningElement, track } from 'lwc';
import amazonDetails from '@salesforce/apex/amazonIntegration.amazonDetails';

export default class AmazonIntegration extends LightningElement {
    productName = '';
    countryValue = '';
    pageSize = 6;
    currentPage = 1;
    totalProducts;
    @track errorMessage = '';
    @track nodata = false;


    @track getamazonDetails = {};
    @track paginatedProducts = [];
    totalPages = 0;
    isLoading = false;
    showFilters = false;

    pageSizeOptions = [
        { label: '3', value: 3 },
        { label: '6', value: 6 },
        { label: '9', value: 9 },
        { label: '12', value: 12 }
    ];

    countryCodeOptions = [
        { label: 'India', value: 'IN' },
        { label: 'United States', value: 'US' },
        { label: 'France', value: 'FR' },
        { label: 'Germany', value: 'DE' },
        { label: 'Italy', value: 'IT' },
        { label: 'Japan', value: 'JP' },
        { label: 'Canada', value: 'CA' },
        { label: 'China', value: 'CN' },
        { label: 'Australia', value: 'AU' },
        { label: 'Netherlands', value: 'NL' },
        { label: 'Belgium', value: 'BE' },
        { label: 'Switzerland', value: 'CH' },
        { label: 'Russia', value: 'RU' }
    ];

    handleProductName(event) {
        this.productName = event.target.value;
    }

    handleCountryCodeChange(event) {
        this.countryValue = event.detail.value;
    }

    handlePageSizeChange(event) {
        this.pageSize = parseInt(event.detail.value, 10);
        this.currentPage = 1;
        this.updatePagination();
    }

    searchProduct() {
        this.isLoading = true;
        this.showFilters = false;
        this.errorMessage = '';
        this.nodata = false;

        amazonDetails({ ProductName: this.productName, CountryCode: this.countryValue })
            .then((result) => {
                try {
                    this.getamazonDetails = JSON.parse(result);

                    if (!this.getamazonDetails.data || !this.getamazonDetails.data.products || this.getamazonDetails.data.products.length === 0) {
                        this.nodata = true;
                        this.totalProducts = 0;
                        this.paginatedProducts = [];
                    } else {
                        this.nodata = false;
                        this.currentPage = 1;
                        this.updatePagination();
                        this.showFilters = true;
                    }
                } catch (err) {
                    this.errorMessage = 'Something went wrong while processing the product data.';
                    console.error('JSON Parse Error', err);
                    this.getamazonDetails = {};
                }
                this.isLoading = false;
            })
            .catch((error) => {
                console.error('API Error:', error);
                this.errorMessage = 'Failed to fetch product details. Please try again later.';
                this.getamazonDetails = {};
                this.isLoading = false;
            });
    }


    updatePagination() {
        if (!this.getamazonDetails.data || !this.getamazonDetails.data.products) {
            this.paginatedProducts = [];
            return;
        }

        const allProducts = this.getamazonDetails.data.products;
        this.totalProducts = allProducts.length;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;

        this.totalPages = Math.ceil(allProducts.length / this.pageSize);
        this.paginatedProducts = allProducts.slice(start, end);
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }
}