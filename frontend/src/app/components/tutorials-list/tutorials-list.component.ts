import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {

  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  isLoading = true;

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];

  selectedTutorials = new Set<string>();

  constructor(private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      // Backend expects 0-indexed page
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveTutorials(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.isLoading = true;
    this.tutorialService.getAll(params)
      .subscribe({
        next: (response) => {
          const { tutorials, totalItems } = response;
          this.tutorials = tutorials;
          this.count = totalItems;
          console.log(response);

          // Small simulated delay for demonstrating the new premium loading spinner UX
          setTimeout(() => this.isLoading = false, 400);
        },
        error: (e) => {
          console.error(e);
          this.isLoading = false;
        }
      });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveTutorials();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
    this.selectedTutorials.clear();
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  toggleSelection(tutorial: Tutorial, event: any): void {
    event.stopPropagation();
    if (this.selectedTutorials.has(tutorial.id)) {
      this.selectedTutorials.delete(tutorial.id);
    } else {
      this.selectedTutorials.add(tutorial.id);
    }
  }

  deleteSelectedTutorials(): void {
    if (this.selectedTutorials.size === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Selection',
        text: 'Please select at least one tutorial to delete.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    Swal.fire({
      title: 'Are you absolutely sure?',
      text: `This will delete ${this.selectedTutorials.size} tutorial(s) from the database!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Create an array of Observables for all deletes
        const deleteOps = Array.from(this.selectedTutorials).map(id => this.tutorialService.delete(id));

        // Execute them sequentially to avoid overwhelming the server (for simplicity)
        let completed = 0;
        deleteOps.forEach(op => {
          op.subscribe({
            next: (res) => {
              completed++;
              if (completed === deleteOps.length) {
                this.refreshList();
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Selected tutorials deleted',
                  showConfirmButton: false,
                  timer: 1500,
                  toast: true
                });
              }
            },
            error: (e) => console.error(e)
          });
        });
      }
    });
  }

  searchTitle(): void {
    this.page = 1;
    this.retrieveTutorials();
  }

  selectAll(): void {
    if (this.tutorials) {
      if (this.selectedTutorials.size === this.tutorials.length && this.tutorials.length > 0) {
        this.selectedTutorials.clear();
      } else {
        this.tutorials.forEach(t => {
          if (t.id) this.selectedTutorials.add(t.id);
        });
      }
    }
  }

}