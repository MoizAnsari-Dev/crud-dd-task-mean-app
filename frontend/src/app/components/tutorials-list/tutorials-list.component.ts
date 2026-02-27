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
  currentTab: 'all' | 'published' | 'draft' = 'all';

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

    if (this.currentTab === 'published') {
      params[`published`] = true;
    } else if (this.currentTab === 'draft') {
      params[`published`] = false;
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
        text: 'Please select at least one entry to delete.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    Swal.fire({
      title: 'Are you absolutely sure?',
      text: `This will delete ${this.selectedTutorials.size} entry(s) from the database!`,
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

  setTab(tab: 'all' | 'published' | 'draft'): void {
    if (this.currentTab !== tab) {
      this.currentTab = tab;
      this.page = 1;
      this.selectedTutorials.clear();
      this.currentIndex = -1;
      this.currentTutorial = {};
      this.retrieveTutorials();
    }
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

  quickTogglePublish(tutorial: Tutorial, event: Event): void {
    event.stopPropagation();
    if (!tutorial.id) return;
    const status = !tutorial.published;

    this.tutorialService.update(tutorial.id, { published: status }).subscribe({
      next: () => {
        tutorial.published = status;
        Swal.fire({
          position: 'top-end', icon: 'success',
          title: `Entry ${status ? 'Locked' : 'Unlocked'}`,
          showConfirmButton: false, timer: 1500, toast: true
        });
      },
      error: (e) => console.error(e)
    });
  }

  quickRate(tutorial: Tutorial, rating: number, event: Event): void {
    event.stopPropagation();
    if (!tutorial.id) return;

    // Toggle off if they click the same rating
    const newRating = tutorial.rating === rating ? 0 : rating;

    this.tutorialService.update(tutorial.id, { rating: newRating }).subscribe({
      next: () => {
        tutorial.rating = newRating;
        Swal.fire({
          position: 'top-end', icon: 'success',
          title: `Entry Rated ${newRating} Stars!`,
          showConfirmButton: false, timer: 1000, toast: true
        });
      },
      error: (e) => console.error(e)
    });
  }

  quickTogglePin(tutorial: Tutorial, event: Event): void {
    event.stopPropagation();
    if (!tutorial.id) return;
    const isPinned = !tutorial.pinned;

    this.tutorialService.update(tutorial.id, { pinned: isPinned ? true : null }).subscribe({
      next: () => {
        tutorial.pinned = isPinned;
        Swal.fire({
          position: 'top-end', icon: 'success',
          title: `Entry ${isPinned ? 'Pinned' : 'Unpinned'}`,
          showConfirmButton: false, timer: 1500, toast: true
        });
        if (isPinned) this.page = 1; // Jump to page 1 if pinned so they can see it at the top
        this.refreshList(); // Reload to re-sort items
      },
      error: (e) => console.error(e)
    });
  }

  quickDelete(id: string | undefined, event: Event): void {
    event.stopPropagation();
    if (!id) return;

    Swal.fire({
      title: 'Delete this entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tutorialService.delete(id).subscribe({
          next: () => {
            this.refreshList();
            Swal.fire({
              position: 'top-end', icon: 'success',
              title: 'Tutorial deleted',
              showConfirmButton: false, timer: 1500, toast: true
            });
          },
          error: (e) => console.error(e)
        });
      }
    });
  }

  getTags(title: string | undefined): string[] {
    if (!title) return [];
    let tags: string[] = [];
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('work') || lowerTitle.includes('job')) tags.push('Work');
    if (lowerTitle.includes('life') || lowerTitle.includes('personal')) tags.push('Personal');
    if (lowerTitle.includes('goal') || lowerTitle.includes('plan')) tags.push('Goals');
    if (lowerTitle.includes('idea') || lowerTitle.includes('thought')) tags.push('Ideas');
    if (lowerTitle.includes('memory') || lowerTitle.includes('remember')) tags.push('Memories');

    return tags;
  }
}